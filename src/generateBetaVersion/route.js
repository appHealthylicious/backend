// src/generate/route.js

const handler = require('./handler');

module.exports = [
  {
    method: 'POST',
    path: '/generate',
    handler: handler.generateRecommendationsHandler,
  }
];
