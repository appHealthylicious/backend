// src/utils/firebase.js
require('dotenv').config();
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');

try {
  const app = firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: process.env.DATABASE_URL
  });
  console.log('Firebase initialized successfully');
  //console.log('Database URL:', app.options_.databaseURL);
} catch (error) {
  console.error('Error initializing Firebase:', error);
}

module.exports = firebaseAdmin;
