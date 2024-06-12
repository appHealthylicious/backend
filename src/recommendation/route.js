const { getRecommendationHandler } = require('./handler');

module.exports = [
  {
    method: 'GET',
    path: '/recommendations',
    handler: getRecommendationHandler
  }
];
