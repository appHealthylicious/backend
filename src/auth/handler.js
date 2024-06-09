const firebaseAdmin = require("../utils/firebase");
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Signature Token
const secretKey = process.env.JWT_SECRET;
const apiKey = process.env.FIREBASE_API_KEY;

const verifyPassword = async (email, password) => {
  const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  try {
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error.message);
  }
};

const register = async (request, h) => {
  try {
    const { email, password } = request.payload;

    if (!email || !password) {
      return h.response({ error: "Email and password are required" }).code(400);
    }

    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });

    return h.response({ message: "User registered successfully", uid: userRecord.uid }).code(201);
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    await verifyPassword(email, password);

    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

    const token = jwt.sign({ uid: userRecord.uid }, secretKey, { expiresIn: '1h' });

    return h.response({ message: "Login successful", token, uid: userRecord.uid }).code(200);
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return h.response({ error: error.message }).code(401);
  }
};

const loginWithGoogle = async (request, h) => {
  try {
    const { idToken } = request.payload;

    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const token = jwt.sign({ uid }, secretKey, { expiresIn: '1h' });

    return h.response({ message: "Login with Google successful", token, uid }).code(200);
  } catch (error) {
    console.error(`Login with Google error: ${error.message}`);
    return h.response({ error: error.message }).code(401);
  }
};

module.exports = { register, login, loginWithGoogle };
