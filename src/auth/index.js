// src/auth/index.js
const routes = require("./route");

module.exports = {
  name: "auth",
  register: async (server, options) => {
    server.route(routes);
  },
};
