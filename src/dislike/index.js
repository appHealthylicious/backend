// src/dislike/index.js
const routes = require('./route');

module.exports = {
  name: 'dislike',
  register: async (server, options) => {
    server.route(routes);
  },
};
