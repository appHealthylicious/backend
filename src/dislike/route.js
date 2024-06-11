// src/dislike/route.js
const handler = require('./Handler');
const verifyToken = require('../middleware/auth');

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
  },
  {
    method: 'POST',
    path: '/user/dislikes',
    handler: handler.addDislikedIngredients,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'GET',
    path: '/user/dislikes',
    handler: handler.getDislikedIngredients,
    options: {
      pre: [{ method: verifyToken }]
    }
  }
];
