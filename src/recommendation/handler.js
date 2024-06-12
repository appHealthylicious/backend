const { getRecommendations } = require('../services/recommendationService');

const getRecommendationHandler = async (request, h) => {
  const categories = ['breakfast', 'lunch', 'dinner', 'dessert', 'snack'];
  const recommendations = getRecommendations(categories);
  
  // Filter hanya untuk title dan image
  const filteredRecommendations = {};
  for (const category in recommendations) {
    filteredRecommendations[category] = recommendations[category].map(recipe => ({
      title: recipe.title,
      image: recipe.image
    }));
  }
  
  return h.response(filteredRecommendations).code(200);
};

module.exports = { getRecommendationHandler };
