// src/dislike/route.js
const dislikeHandler = require('./handler');
const verifyToken = require('../middleware/auth');

module.exports = [
  {
    method: 'POST',
    path: '/user/dislikes',
    handler: dislikeHandler.addDislikedIngredients,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'GET',
    path: '/user/dislikes',
    handler: dislikeHandler.getDislikedIngredients,
    options: {
      pre: [{ method: verifyToken }]
    }
  }
];

