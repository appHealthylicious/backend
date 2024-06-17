const handler = require('./handler');
const verifyToken = require('../middleware/auth');

module.exports = [
  {
    method: 'GET',
    path: '/rate/recommendations',
    handler: handler.getRecommendationHandler,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'POST',
    path: '/rate',
    handler: handler.addRatingHandler,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'GET',
    path: '/rating',
    handler: handler.getAverageRatingsHandler,
  }
];
