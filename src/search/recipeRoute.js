const { getAllRecipesHandler, searchRecipeTitlesHandler, getRecipeDetailsHandler } = require('./recipeHandler');

module.exports = [
  {
    method: 'GET',
    path: '/recipes',
    handler: getAllRecipesHandler
  },
  {
    method: 'GET',
    path: '/recipes/search',
    handler: searchRecipeTitlesHandler
  },
  {
    method: 'GET',
    path: '/recipes/{title}',
    handler: getRecipeDetailsHandler
  }
];
