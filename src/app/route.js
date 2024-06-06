// src/app/route.js
const handler = require('./handler');
const verifyToken = require('../middleware/auth');

module.exports = [
  {
    method: 'POST',
    path: '/user/profile',
    handler: handler.addUserProfile,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'PUT',
    path: '/user/profile',
    handler: handler.updateUserProfile,
    options: {
      pre: [{ method: verifyToken }]
    }
  },
  {
    method: 'GET',
    path: '/user/profile/{uid}',
    handler: handler.getUserProfile,
    options: {
      pre: [{ method: verifyToken }]
    }
  }
];
