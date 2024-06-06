// src/auth/handler.js
const firebaseAdmin = require("../utils/firebase");
const jwt = require('jsonwebtoken');

// Signature Token
const secretKey = process.env.JWT_SECRET;

const register = async (request, h) => {
  try {
    const { email, password } = request.payload;

    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
    });

    // Tambahkan UID ke respons
    return h.response({ message: "User registered successfully", uid: userRecord.uid }).code(201);
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

const login = async (request, h) => {
  try {
    const { email, password } = request.payload;

    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

    // Buat JWT
    const token = jwt.sign({ uid: userRecord.uid }, secretKey, { expiresIn: '1h' });

    return h.response({ message: "Login successful", token, uid: userRecord.uid }).code(200);
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { register, login };
