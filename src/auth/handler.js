const firebaseAdmin = require("../utils/firebase");
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { sendResetPasswordEmail } = require('../utils/nodemailer');
const crypto = require('crypto');

// Signature Token
const secretKey = process.env.JWT_SECRET;
const apiKey = process.env.FIREBASE_API_KEY;

// Simpan token temporary
const resetTokens = {};

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

    // Cek database apakah user terdaftar
    const db = firebaseAdmin.database();
    const userRef = db.ref('users/' + uid);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      await userRef.set({
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture || ''
      });
    }

    const token = jwt.sign({ uid }, secretKey, { expiresIn: '1h' });

    return h.response({ message: "Login with Google successful", token, uid }).code(200);
  } catch (error) {
    console.error(`Login with Google error: ${error.message}`);
    return h.response({ error: error.message }).code(401);
  }
};

const requestPasswordReset = async (request, h) => {
  const { email } = request.payload;

  try {
    const userRecord = await firebaseAdmin.auth().getUserByEmail(email);

    // Buat token reset password
    const token = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 3600000; // Token berlaku selama 1 jam

    // Simpan token dan waktu kadaluarsa di database atau in-memory store
    resetTokens[userRecord.uid] = { token, tokenExpiration };

    // Kirim email reset password
    await sendResetPasswordEmail(email, token);

    return h.response({ message: 'Password reset email sent' }).code(200);
  } catch (error) {
    console.error(`Error sending reset password email: ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

const resetPassword = async (request, h) => {
  const { token, newPassword } = request.payload;

  try {
    // Cari token di database atau in-memory store
    const uid = Object.keys(resetTokens).find(uid => resetTokens[uid].token === token);
    if (!uid) {
      return h.response({ error: 'Invalid or expired token' }).code(400);
    }

    const { tokenExpiration } = resetTokens[uid];
    if (Date.now() > tokenExpiration) {
      return h.response({ error: 'Token expired' }).code(400);
    }

    // Atur ulang password
    await firebaseAdmin.auth().updateUser(uid, { password: newPassword });

    // Hapus token setelah digunakan
    delete resetTokens[uid];

    return h.response({ message: 'Password reset successful' }).code(200);
  } catch (error) {
    console.error(`Error resetting password: ${error.message}`);
    return h.response({ error: error.message }).code(500);
  }
};

module.exports = { register, login, loginWithGoogle, requestPasswordReset, resetPassword };
