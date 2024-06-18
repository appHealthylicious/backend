const path = require('path');
const csv = require('csv-parser');
const fs = require('fs');
const natural = require('natural');
const cosineSimilarity = require('compute-cosine-similarity');
const admin = require('../utils/firebase');

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

const getUserDislikedIngredients = async (userId) => {
  const userRef = admin.database().ref(`users/${userId}`);
  const snapshot = await userRef.once('value');
  const userData = snapshot.val();
  return userData ? userData.dislikedIngredients || [] : [];
};

const generateRecommendations = async (userId, ingredients) => {
  try {
    const recipesPath = path.join(__dirname, '../../models/recipes_cleaned_ids.csv');
    const recipes = await loadCSV(recipesPath);
    
    const dislikedIngredients = await getUserDislikedIngredients(userId);

    const tfidf = new natural.TfIdf();
    recipes.forEach(recipe => {
      tfidf.addDocument(recipe.Ingredients);
    });

    const userTfidf = new natural.TfIdf();
    userTfidf.addDocument(ingredients);

    const userVec = userTfidf.documents[0];

    const similarities = recipes.map((recipe, index) => {
      const recipeVec = tfidf.documents[index];
      const terms = new Set([...Object.keys(userVec), ...Object.keys(recipeVec)]);
      const userFullVec = Array.from(terms).map(term => userVec[term] || 0);
      const recipeFullVec = Array.from(terms).map(term => recipeVec[term] || 0);

      const similarityScore = cosineSimilarity(userFullVec, recipeFullVec);
      return { ...recipe, similarity: similarityScore };
    });

    const topK = similarities
      .filter(item => item.similarity > 0)
      .filter(recipe => !dislikedIngredients.some(ingredient => recipe.Ingredients.includes(ingredient)))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 10);

    return topK.map(recipe => ({
      recipeId: recipe.recipeId,
      title: recipe.Title,
      ingredients: recipe.Ingredients,
      similarity: recipe.similarity
    }));
  } catch (error) {
    console.error(`Error in generateRecommendations for user ID ${userId}:`, error);
    throw error;
  }
};

module.exports = { generateRecommendations };