// src/app/handler.js
const firebaseAdmin = require("../utils/firebase");

const addUserProfile = async (request, h) => {
  try {
    const { username, age, weight, height } = request.payload;
    const uid = request.auth.uid;

    const db = firebaseAdmin.database();
    console.log('Attempting to add user profile for UID:', uid);

    await db.ref('users/' + uid).set({
      username,
      age,
      weight,
      height
    });

    console.log('User profile added successfully for UID:', uid);
    return h.response({ message: "User profile added successfully" }).code(201);
  } catch (error) {
    console.error(`Add user profile error: ${error.code} - ${error.message}`);
    console.error(error);  // Log full error
    return h.response({ error: error.message }).code(500);
  }
};

const updateUserProfile = async (request, h) => {
  try {
    const { username, age, weight, height } = request.payload;
    const uid = request.auth.uid;

    const db = firebaseAdmin.database();
    console.log('Attempting to update user profile for UID:', uid);

    await db.ref('users/' + uid).update({
      username,
      age,
      weight,
      height
    });

    console.log('User profile updated successfully for UID:', uid);
    return h.response({ message: "User profile updated successfully" }).code(200);
  } catch (error) {
    console.error(`Update user profile error: ${error.code} - ${error.message}`);
    console.error(error);  // Log full error
    return h.response({ error: error.message }).code(500);
  }
};

const getUserProfile = async (request, h) => {
  try {
    const { uid } = request.params;

    // Verifikasi UID dari token cocok dengan UID di URL
    if (uid !== request.auth.uid) {
      return h.response({ error: "Unauthorized access to user profile" }).code(403);
    }

    const db = firebaseAdmin.database();
    console.log('Attempting to get user profile for UID:', uid);

    const snapshot = await db.ref('users/' + uid).once('value');
    const userProfile = snapshot.val();

    if (userProfile) {
      console.log('User profile retrieved successfully for UID:', uid);
      return h.response({ userProfile }).code(200);
    } else {
      console.log('User profile not found for UID:', uid);
      return h.response({ error: "User profile not found" }).code(404);
    }
  } catch (error) {
    console.error(`Get user profile error: ${error.code} - ${error.message}`);
    console.error(error);  // Log full error
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { addUserProfile, updateUserProfile, getUserProfile };
