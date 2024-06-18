// src/generate/handler.js
const { generateRecommendations } = require('../services/generateService');

const generateRecommendationHandler = async (request, h) => {
  try {
    const userId = request.auth.uid;
    const { ingredients } = request.payload;
    console.log(`Received generate recommendations request for user ID: ${userId} with ingredients: ${ingredients}`);
    const recommendations = await generateRecommendations(userId, ingredients);
    return h.response(recommendations).code(200);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { generateRecommendationHandler };
