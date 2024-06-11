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
  return ingredients.filter(ingredient => 
    ingredient.Ingredient.toLowerCase().includes(query.toLowerCase())
  );
};

module.exports = { initializeIngredients, getIngredients, searchIngredients };


