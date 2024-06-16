require('dotenv').config();
const Hapi = require("@hapi/hapi");
const authRoutes = require('./auth');
const appRoutes = require('./app');
const searchPlugin = require('./search'); 
const dislikePlugin = require('./dislike');
const recommendationRoutes = require('./recommendation');
const mlRoutes = require('./ml');
const { initializeIngredients } = require('./services/ingredientService');
const { initializeRecipes } = require('./services/recipeService');
const { loadRecipeData } = require('./services/recommendationService');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 8080,
    host: '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(authRoutes);
  await server.register(appRoutes);
  await server.register(searchPlugin); 
  await server.register(dislikePlugin); 
  await server.register(recommendationRoutes);
  await server.register(mlRoutes);

  initializeIngredients();
  initializeRecipes();
  loadRecipeData();

  await server.start();
  console.log(`Server running on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init().then(() => console.log('Server initialized successfully'))
       .catch(err => console.error('Server initialization failed:', err));
