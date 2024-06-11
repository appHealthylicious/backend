// src/search/index.js
const routes = require('./route');

module.exports = {
  name: 'search',
  register: async (server, options) => {
    server.route(routes);
  },
};
