const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let recipeTitles = [];
let recipeData = [];

const loadRecipeTitles = () => {
  fs.createReadStream(path.join(__dirname, '../../models/recipesTitle.csv'))
    .pipe(csv())
    .on('data', (row) => {
      recipeTitles.push(row);
    })
    .on('end', () => {
      console.log('Recipe titles CSV file successfully processed');
    });
};

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

// Panggil fungsi ini saat aplikasi dimulai
const initializeRecipes = () => {
  loadRecipeTitles();
  loadRecipeData();
};

const getAllRecipeTitles = () => {
  return recipeTitles;
};

const searchRecipeTitles = (query) => {
  const cleanedQuery = query.toLowerCase();
  return recipeTitles
    .filter(title => title.Title.toLowerCase().includes(cleanedQuery))
    .sort((a, b) => {
      const aLower = a.Title.toLowerCase();
      const bLower = b.Title.toLowerCase();
      const aStartsWith = aLower.startsWith(cleanedQuery);
      const bStartsWith = bLower.startsWith(cleanedQuery);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      return a.Title.length - b.Title.length;
    });
};

const getRecipeDetails = (title) => {
  console.log(`Available titles: ${recipeData.map(recipe => recipe.title)}`);
  return recipeData.filter(recipe => recipe.title === title);
};

module.exports = { initializeRecipes, getAllRecipeTitles, searchRecipeTitles, getRecipeDetails };
