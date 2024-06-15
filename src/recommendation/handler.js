const { getRecommendations } = require('../services/recommendationService');

const getRecommendationHandler = async (request, h) => {
  const categories = ['easy_to_make', 'quick_to_cook','breakfast','dessert', 'snack'];
  const recommendations = getRecommendations(categories);

  const uniqueRecipes = new Set();
  const filteredRecommendations = {};

  for (const category of categories) {
    filteredRecommendations[category] = recommendations[category]
      .filter(recipe => {
        if (uniqueRecipes.has(recipe.title)) {
          return false;
        } else {
          uniqueRecipes.add(recipe.title);
          return true;
        }
      })
      .map(recipe => ({
        title: recipe.title,
        image: recipe.image
      }));
  }

  return h.response(filteredRecommendations).code(200);
};

module.exports = { getRecommendationHandler };
