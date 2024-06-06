// src/middleware/auth.js
const jwt = require('jsonwebtoken');

// Signature Token
const secretKey = process.env.JWT_SECRET;

const verifyToken = async (request, h) => {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return h.response({ error: 'Authorization header is missing' }).code(401).takeover();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, secretKey);
    request.auth = { uid: decodedToken.uid };
    return h.continue;
  } catch (error) {
    console.error('Error verifying token:', error);
    return h.response({ error: 'Invalid token' }).code(401).takeover();
  }
};

module.exports = verifyToken;
