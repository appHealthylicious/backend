// src/search/ingredientHandler.js
const { getIngredients, searchIngredients, categorizeIngredients } = require('../services/ingredientService');

const formatGroupedIngredients = (groupedIngredients) => {
  return Object.keys(groupedIngredients).map(category => ({
    category,
    items: groupedIngredients[category]
  }));
};

const getAllIngredients = async (request, h) => {
  const ingredients = getIngredients();
  const groupedIngredients = categorizeIngredients();
  const formattedGroupedIngredients = formatGroupedIngredients(groupedIngredients);
  return h.response(formattedGroupedIngredients).code(200);
};

const searchAllIngredients = async (request, h) => {
  const { query } = request.query;
  const results = searchIngredients(query);
  return h.response(results).code(200);
};

module.exports = { getAllIngredients, searchAllIngredients };
