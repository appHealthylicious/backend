// src/search/ingredeintRoute.js
const handler = require('./ingredientHandler');

module.exports = [
  {
    method: 'GET',
    path: '/ingredients',
    handler: handler.getAllIngredients,
  },
  {
    method: 'GET',
    path: '/ingredients/search',
    handler: handler.searchAllIngredients,
  }
];
