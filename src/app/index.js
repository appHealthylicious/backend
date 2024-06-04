// src/app/index.js
const routes = require("./route");

module.exports = {
  name: "app",
  register: async (server, options) => {
    server.route(routes);
  },
};
