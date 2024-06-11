// src/dislike/index.js
const routes = require('./Route');

module.exports = {
  name: 'dislike',
  register: async (server, options) => {
    server.route(routes);
  },
};