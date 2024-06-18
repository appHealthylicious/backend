const routes = require('./route');

module.exports = {
  name: 'generateBeta',
  register: async (server, options) => {
    server.route(routes);
  },
};
