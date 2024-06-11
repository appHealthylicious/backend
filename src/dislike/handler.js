// src/dislike/handler.js
const firebaseAdmin = require("../utils/firebase");

const addDislikedIngredients = async (request, h) => {
  try {
    const { uid } = request.auth;
    const ingredients = request.payload; 

    if (!Array.isArray(ingredients) || !ingredients.every(ing => typeof ing === 'string')) {
      return h.response({ error: "Invalid payload format" }).code(400);
    }

    const db = firebaseAdmin.database();
    await db.ref('users/' + uid + '/dislikedIngredients').set(ingredients);

    return h.response({ message: "Disliked ingredients added successfully" }).code(200);
  } catch (error) {
    console.error(`Add disliked ingredients error: ${error.code} - ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

const getDislikedIngredients = async (request, h) => {
  try {
    const { uid } = request.auth;

    const db = firebaseAdmin.database();
    const snapshot = await db.ref('users/' + uid + '/dislikedIngredients').once('value');
    const dislikedIngredients = snapshot.val();

    return h.response(dislikedIngredients || []).code(200);
  } catch (error) {
    console.error(`Get disliked ingredients error: ${error.code} - ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { addDislikedIngredients, getDislikedIngredients };

