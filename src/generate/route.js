// src/generate/route.js
const handler = require('./handler');
const verifyToken = require('../middleware/auth');

module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: handler.generateRecommendationHandler,
    options: {
      pre: [{ method: verifyToken }]
    }
  }
];
