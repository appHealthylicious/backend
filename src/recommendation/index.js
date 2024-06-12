const routes = require('./route');

module.exports = {
  name: 'recommendation',
  register: async (server, options) => {
    server.route(routes);
  },
};
