// src/dislike/handler.js
const firebaseAdmin = require("../utils/firebase");
const { getIngredients, searchIngredients } = require('../services/ingredientService');

const groupIngredientsByFirstLetter = (ingredients) => {
  return ingredients.reduce((acc, ingredient) => {
    const firstLetter = ingredient.Ingredient.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(ingredient.Ingredient);
    return acc;
  }, {});
};

const getAllIngredients = async (request, h) => {
  const ingredients = getIngredients();
  const groupedIngredients = groupIngredientsByFirstLetter(ingredients);
  return h.response(groupedIngredients).code(200);
};

const searchAllIngredients = async (request, h) => {
  const { query } = request.query;
  const results = searchIngredients(query).map(ingredient => ingredient.Ingredient);
  return h.response(results).code(200);
};

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

module.exports = { getAllIngredients, searchAllIngredients, addDislikedIngredients, getDislikedIngredients };
