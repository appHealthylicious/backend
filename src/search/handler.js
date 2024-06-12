const { getIngredients, searchIngredients, categorizeIngredients } = require('../services/ingredientService');

const getAllIngredients = async (request, h) => {
  const ingredients = getIngredients();
  const groupedIngredients = categorizeIngredients();
  return h.response(groupedIngredients).code(200);
};

const searchAllIngredients = async (request, h) => {
  const { query } = request.query;
  const results = searchIngredients(query);
  return h.response(results).code(200);
};

module.exports = { getAllIngredients, searchAllIngredients };
