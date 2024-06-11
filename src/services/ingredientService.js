// src/services/ingredientService.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

let ingredients = [];

const loadIngredients = () => {
  fs.createReadStream(path.join(__dirname, '../../models/ingredients.csv'))
    .pipe(csv())
    .on('data', (row) => {
      ingredients.push(row);
    })
    .on('end', () => {
      console.log('CSV file successfully processed');
    });
};

const initializeIngredients = () => {
  loadIngredients();
};

const getIngredients = () => {
  return ingredients;
};

const searchIngredients = (query) => {
  const cleanedQuery = query.toLowerCase();
  return ingredients
    .map(ingredient => ingredient.Ingredient)
    .filter(name => name.toLowerCase().includes(cleanedQuery))
    .sort((a, b) => {
      const aLower = a.toLowerCase();
      const bLower = b.toLowerCase();
      const aStartsWith = aLower.startsWith(cleanedQuery);
      const bStartsWith = bLower.startsWith(cleanedQuery);

      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;

      return a.length - b.length;
    });
};

module.exports = { initializeIngredients, getIngredients, searchIngredients };



