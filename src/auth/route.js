// src/auth/route.js
const handler = require("./handler");

module.exports = [
  {
    method: "POST",
    path: "/register",
    handler: handler.register,
  },
  {
    method: "POST",
    path: "/login",
    handler: handler.login,
  },
];
