// src/search/handler.js

const { getIngredients, searchIngredients } = require('../services/ingredientService');

const groupIngredientsByFirstLetter = (ingredients) => {
  return ingredients.reduce((acc, ingredient) => {
    const firstLetter = ingredient.Ingredient.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(ingredient.Ingredient);
    return acc;
  }, {});
};

const getAllIngredients = async (request, h) => {
  const ingredients = getIngredients();
  const groupedIngredients = groupIngredientsByFirstLetter(ingredients);
  return h.response(groupedIngredients).code(200);
};

const searchAllIngredients = async (request, h) => {
    const { query } = request.query;
    const results = searchIngredients(query);
    return h.response(results).code(200);
  };

module.exports = { getAllIngredients, searchAllIngredients };
