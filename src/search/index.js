// src/search/index.js
const ingredientRoutes = require('./ingredientRoute');
const recipeRoutes = require('./recipeRoute');

module.exports = {
  name: 'search',
  register: async (server, options) => {
    server.route([...ingredientRoutes, ...recipeRoutes]);
  },
};