const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const natural = require('natural');
const cosineSimilarity = require('compute-cosine-similarity');
const firebaseAdmin = require('../utils/firebase');

const db = firebaseAdmin.database();

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

const getRecommendations = async (userId) => {
  try {
    const recipesPath = path.join(__dirname, '../../models/recipes_dataset.csv');
    const recipes = await loadCSV(recipesPath);

    // Ambil data rating pengguna dari Firebase
    const userRatingsRef = db.ref(`users/${userId}/ratings`);
    const userRatingsSnapshot = await userRatingsRef.once('value');
    const userRatings = userRatingsSnapshot.val();

    if (!userRatings) {
      throw new Error('No ratings found for this user.');
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

    const recommendations = topK.map(({ index }) => {
      const recipe = recipes[index];
      return {
        recipeId: recipe.recipeId,
        title: recipe.Title,
        similarity: similarities[index]
      };
    });

    return recommendations;
  } catch (error) {
    console.error(`Error in getRecommendations for user ID ${userId}:`, error);
    throw error;
  }
};

const addRating = async (userId, recipeId, rating) => {
  try {
    const userRef = db.ref(`users/${userId}/ratings/${recipeId}`);
    await userRef.set(rating);

    // Update recommendations
    return await getRecommendations(userId);
  } catch (error) {
    console.error(`Error adding rating for user ID ${userId}:`, error);
    throw error;
  }
};

module.exports = { getRecommendations, addRating };
