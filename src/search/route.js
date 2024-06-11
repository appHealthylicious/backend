// src/search/route.js
const handler = require('./handler');

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
