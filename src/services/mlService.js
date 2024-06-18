const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const natural = require('natural');
const cosineSimilarity = require('compute-cosine-similarity');
const firebaseAdmin = require('../utils/firebase');

const loadCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const getPopularRecipes = async (recipes) => {
  console.log("Fetching popular recipes...");
  const ratingsSnapshot = await firebaseAdmin.database().ref('users').once('value');
  const users = ratingsSnapshot.val() || {};

  if (Object.keys(users).length === 0) {
    console.log("No users data available.");
    return [];
  }

  const recipeStats = {};
  Object.keys(users).forEach(userId => {
    const userRatings = users[userId].ratings || {};
    Object.keys(userRatings).forEach(recipeId => {
      if (!recipeStats[recipeId]) {
        recipeStats[recipeId] = { sum: 0, count: 0 };
      }
      recipeStats[recipeId].sum += userRatings[recipeId];
      recipeStats[recipeId].count += 1;
    });
  });

  const popularRecipes = Object.keys(recipeStats)
    .map(recipeId => {
      const { sum, count } = recipeStats[recipeId];
      const mean_rating = sum / count;
      const recipe = recipes.find(r => r.recipeId === recipeId) || {};
      return {
        recipeId,
        mean_rating,
        rating_count: count,
        title: recipe.Title || 'Unknown Title',
        image: recipe.Image
      };
    })
    .sort((a, b) => b.mean_rating - a.mean_rating)
    .slice(0, 10);

  return popularRecipes;
};

const getRecommendations = async (userId) => {
  try {
    const recipesPath = path.join(__dirname, '../../models/recipes_cleaned_ids.csv');
    const recipes = await loadCSV(recipesPath);

    const userRef = firebaseAdmin.database().ref(`users/${userId}`);
    const userSnapshot = await userRef.once('value');
    const userData = userSnapshot.val();

    if (!userData) {
      console.log(`No user data found for user ${userId}. Showing popular recipes.`);
      return await getPopularRecipes(recipes);
    }

    const userRatings = userData.ratings || {};
    const dislikedIngredients = userData.dislikedIngredients || [];

    if (!userRatings || Object.keys(userRatings).length === 0) {
      console.log(`No ratings found for user ${userId}. Showing popular recipes.`);
      return await getPopularRecipes(recipes);
    }

    const tfidf = new natural.TfIdf();
    recipes.forEach(recipe => {
      tfidf.addDocument(recipe.Ingredients);
    });

    const recipeIndex = {};
    recipes.forEach((recipe, index) => {
      recipeIndex[recipe.recipeId] = index;
    });

    const similarities = Array(tfidf.documents.length).fill(0);
    Object.keys(userRatings).forEach(recipeId => {
      const recipeIdx = recipeIndex[recipeId];
      if (recipeIdx !== undefined && tfidf.documents[recipeIdx] !== undefined) {
        console.log(`Calculating similarity for recipe: ${recipes[recipeIdx].Title}`);
        for (let i = 0; i < tfidf.documents.length; i++) {
          if (tfidf.documents[i] !== undefined) {
            const vec1 = tfidf.documents[recipeIdx];
            const vec2 = tfidf.documents[i];

            const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
            const fullVec1 = Array.from(terms).map(term => vec1[term] || 0);
            const fullVec2 = Array.from(terms).map(term => vec2[term] || 0);

            const similarityScore = cosineSimilarity(fullVec1, fullVec2);
            similarities[i] += similarityScore;
          }
        }
      }
    });

    const similarityThreshold = 0.1; // Adjust the threshold as needed

    const topK = similarities
      .map((similarity, index) => ({ index, similarity }))
      .filter(item => item.similarity > similarityThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    const recommendations = topK
      .map(({ index }) => {
        const recipe = recipes[index];
        return {
          recipeId: recipe.recipeId,
          title: recipe.Title,
          similarity: similarities[index],
          image: recipe.Image
        };
      })
      .filter(recipe => {
        const recipeIngredients = recipes[recipeIndex[recipe.recipeId]].Ingredients.toLowerCase();
        return !dislikedIngredients.some(ingredient => recipeIngredients.includes(ingredient.toLowerCase()));
      });

    if (recommendations.length === 0) {
      console.log(`No recommendations left after filtering for user ${userId}. Showing popular recipes.`);
      return await getPopularRecipes(recipes);
    }

    return recommendations;
  } catch (error) {
    console.error(`Error in getRecommendations for user ID ${userId}:`, error);
    throw error;
  }
};

const addRating = async (userId, recipeId, rating) => {
  try {
    const ratingRef = firebaseAdmin.database().ref(`users/${userId}/ratings/${recipeId}`);
    await ratingRef.set(rating);
    console.log(`Rating added for user ID ${userId}, recipe ID ${recipeId}, rating ${rating}`);
  } catch (error) {
    console.error(`Error adding rating for user ID ${userId}, recipe ID ${recipeId}:`, error);
    throw error;
  }
};

const getAverageRatings = async () => {
  try {
    const ratingsSnapshot = await firebaseAdmin.database().ref('users').once('value');
    const users = ratingsSnapshot.val() || {};

    if (Object.keys(users).length === 0) {
      console.log("No ratings data available.");
      return [];
    }

    const recipeStats = {};
    Object.keys(users).forEach(userId => {
      const userRatings = users[userId].ratings || {};
      Object.keys(userRatings).forEach(recipeId => {
        if (!recipeStats[recipeId]) {
          recipeStats[recipeId] = { sum: 0, count: 0 };
        }
        recipeStats[recipeId].sum += userRatings[recipeId];
        recipeStats[recipeId].count += 1;
      });
    });

    const averageRatings = Object.keys(recipeStats)
      .map(recipeId => {
        const { sum, count } = recipeStats[recipeId];
        const mean_rating = sum / count;
        return {
          recipeId,
          mean_rating,
          rating_count: count
        };
      })
      .sort((a, b) => b.mean_rating - a.mean_rating);

    return averageRatings;
  } catch (error) {
    console.error('Error getting average ratings:', error);
    throw error;
  }
};

module.exports = { getRecommendations, addRating, getAverageRatings };
