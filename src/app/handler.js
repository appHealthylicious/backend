// src/app/handler.js
const firebaseAdmin = require("../utils/firebase");

const addUserProfile = async (request, h) => {
  try {
    const { uid, username, age, weight, height } = request.payload;
    
    const db = firebaseAdmin.database();
    //console.log('Database URL:', process.env.DATABASE_URL); // LOG DATABASE URL
    //console.log('Attempting to add user profile');

    // TES KE REALTIME DATABASE
    // await db.ref('test').set({ test: 'test' });
    // console.log('Test write successful');

    await db.ref('users/' + uid).set({
      username,
      age,
      weight,
      height
    });

    console.log('User profile added successfully');
    return h.response({ message: "User profile added successfully" }).code(201);
  } catch (error) {
    console.error(`Add user profile error: ${error.code} - ${error.message}`);
    console.error(error);  // Log the full error lebih DETAIL 
    return h.response({ error: error.message }).code(500);
  }
};

const updateUserProfile = async (request, h) => {
  try {
    const { uid, username, age, weight, height } = request.payload;

    const db = firebaseAdmin.database();
    //console.log('Database URL:', process.env.DATABASE_URL); // LOG DATABASE URL
    console.log('Attempting to update user profile');

    await db.ref('users/' + uid).update({
      username,
      age,
      weight,
      height
    });

    console.log('User profile updated successfully');
    return h.response({ message: "User profile updated successfully" }).code(200);
  } catch (error) {
    console.error(`Update user profile error: ${error.code} - ${error.message}`);
    console.error(error);  // Log the full error 
    return h.response({ error: error.message }).code(500);
  }
};

const getUserProfile = async (request, h) => {
    try {
      const { uid } = request.params;
  
      const db = firebaseAdmin.database();
      console.log('Attempting to get user profile');
  
      const snapshot = await db.ref('users/' + uid).once('value');
      const userProfile = snapshot.val();
  
      if (userProfile) {
        console.log('User profile retrieved successfully');
        return h.response({ userProfile }).code(200);
      } else {
        console.log('User profile not found');
        return h.response({ error: "User profile not found" }).code(404);
      }
    } catch (error) {
      console.error(`Get user profile error: ${error.code} - ${error.message}`);
      console.error(error);  // Log full Error
      return h.response({ error: error.message }).code(500);
    }
  };
  
  module.exports = { addUserProfile, updateUserProfile, getUserProfile };

