// src/server.js
const Hapi = require("@hapi/hapi");
const authRoutes = require('./auth');
const appRoutes = require('./app');

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: "localhost",
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(authRoutes);
  await server.register(appRoutes);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
