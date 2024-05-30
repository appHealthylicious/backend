// src/server.js
const Hapi = require("@hapi/hapi");
const AuthPlugin = require("./auth");

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

  await server.register(AuthPlugin);

  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
