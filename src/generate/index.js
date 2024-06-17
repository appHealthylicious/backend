// src/generate/index.js

const routes = require('./route');

module.exports = {
  name: 'generate',
  register: async (server, options) => {
    server.route(routes);
  },
};
