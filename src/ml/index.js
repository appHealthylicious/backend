// src/ml/index.js

const routes = require('./route');

module.exports = {
  name: 'ml',
  register: async (server, options) => {
    server.route(routes);
  },
};
