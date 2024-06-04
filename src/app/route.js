// src/app/route.js
const handler = require("./handler");

module.exports = [
  {
    method: "POST",
    path: "/user/profile",
    handler: handler.addUserProfile,
  },
  {
    method: "PUT",
    path: "/user/profile",
    handler: handler.updateUserProfile,
  },
  {
    method: "GET",
    path: "/user/profile/{uid}",
    handler: handler.getUserProfile,
  },
];
