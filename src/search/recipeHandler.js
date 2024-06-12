const { getAllRecipeTitles, searchRecipeTitles, getRecipeDetails } = require('../services/recipeService');

const getAllRecipesHandler = async (request, h) => {
  const recipes = getAllRecipeTitles();
  return h.response(recipes).code(200);
};

const searchRecipeTitlesHandler = async (request, h) => {
  const { query } = request.query;
  const results = searchRecipeTitles(query);
  return h.response(results).code(200);
};

const getRecipeDetailsHandler = async (request, h) => {
  const { title } = request.params;
  const formattedTitle = decodeURIComponent(title).replace(/-/g, ' ');
  console.log(`Searching for recipe with title: ${formattedTitle}`);
  const details = getRecipeDetails(formattedTitle);
  if (details.length === 0) {
    console.log('Recipe not found');
    return h.response({ error: "Recipe not found" }).code(404);
  }
  console.log('Recipe found:', details);
  return h.response(details).code(200);
};

module.exports = { getAllRecipesHandler, searchRecipeTitlesHandler, getRecipeDetailsHandler };
