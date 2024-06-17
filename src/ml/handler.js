const { getRecommendations, addRating, getAverageRatings } = require('../services/mlService');

const getRecommendationHandler = async (request, h) => {
  try {
    const userId = request.auth.uid;
    console.log(`Received recommendation request for user ID: ${userId}`);
    const recommendations = await getRecommendations(userId);
    return h.response(recommendations).code(200);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    return h.response({ error: error.message }).code(500);
  }
};

const addRatingHandler = async (request, h) => {
  try {
    const userId = request.auth.uid;
    const { recipeId, rating } = request.payload;
    console.log(`Received rating request for user ID: ${userId}, recipe ID: ${recipeId}, rating: ${rating}`);
    await addRating(userId, recipeId, rating);
    return h.response({ success: true }).code(200);
  } catch (error) {
    console.error('Error adding rating:', error);
    return h.response({ error: error.message }).code(500);
  }
};

const getAverageRatingsHandler = async (request, h) => {
  try {
    console.log('Received request for average ratings');
    const averageRatings = await getAverageRatings();
    return h.response(averageRatings).code(200);
  } catch (error) {
    console.error('Error getting average ratings:', error);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { getRecommendationHandler, addRatingHandler, getAverageRatingsHandler };
