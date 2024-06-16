// src/services/ingredientService.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const categories = require('./ingredientCategories');

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

const categorizeIngredients = () => {
  const categorized = {
    vegetables: [],
    fruits: [],
    dairy: [],
    spices: [],
    meat: [],
    seafood: [],
    grains: [],
    sauces: [],
    other: []
  };

  for (const ingredient of ingredients) {
    const name = ingredient.Ingredient.toLowerCase();
    if (categories.vegetables.includes(name)) {
      categorized.vegetables.push(name);
    } else if (categories.fruits.includes(name)) {
      categorized.fruits.push(name);
    } else if (categories.dairy.includes(name)) {
      categorized.dairy.push(name);
    } else if (categories.spices.includes(name)) {
      categorized.spices.push(name);
    } else if (categories.meat.includes(name)) {
      categorized.meat.push(name);
    } else if (categories.seafood.includes(name)) {
      categorized.seafood.push(name);
    } else if (categories.grains.includes(name)) {
      categorized.grains.push(name);
    } else if (categories.sauces.includes(name)) {
      categorized.sauces.push(name);
    } else {
      categorized.other.push(name);
    }
  }

  return categorized;
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

module.exports = { initializeIngredients, getIngredients, searchIngredients, categorizeIngredients };
