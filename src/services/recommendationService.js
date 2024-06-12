const fs = require('fs');
const path = require('path');

let recipeData = [];

const loadRecipeData = () => {
  fs.readFile(path.join(__dirname, '../../models/recipesData.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading recipeData.json:', err);
      return;
    }
    recipeData = JSON.parse(data);
    console.log('Recipe data JSON file successfully processed');
  });
};

loadRecipeData();

const getRecommendations = (categories, limit = 5) => {
  const recommendations = {};

  categories.forEach(category => {
    recommendations[category] = recipeData
      .filter(recipe => recipe.category && recipe.category.toLowerCase().includes(category.toLowerCase()))
      .slice(0, limit);
  });

  return recommendations;
};

module.exports = { loadRecipeData, getRecommendations };
