import Fastify from 'fastify'
import recipesRoutes from './src/routes/recipeRoutes.js'
import mongoDBConnector from './src/db/mongoDBConnector.js'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from '@fastify/cors';
import dotenv from 'dotenv';
import sqlDBConnector from './src/db/sqlDBConnector.js';
import MongoRecipeRepository from './src/repositories/mongoRecipeRepositories.js';
import recipeService from './src/services/recipeService.js';
import SQLRecipeRepository from './src/repositories/SQLRecipeRepository.js';
import { mongoRecipe as Recipe} from './src/models/mongoRecipe.js';

dotenv.config();
const fastify = Fastify({
  logger: true
})

const swaggerOptions = {
  swagger: {
      info: {
          title: "Hotwings API",
          description: "dual DB API",
          version: "1.0.0",
      },
      host: "127.0.0.1:3000",
  },
};

const swaggerUiOptions = {
  routePrefix: "/docs",
  exposeRoute: true,
};
const recipeRepository = process.env.DB_TYPE === 'mongo' ? new MongoRecipeRepository() : new SQLRecipeRepository(sqlDBConnector);
const service = new recipeService(recipeRepository);
fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);
fastify.register(mongoDBConnector)
fastify.decorate('sqlDbconnector', sqlDBConnector)
fastify.decorate('recipeService', service);
fastify.register(recipesRoutes)
fastify.register(fastifyCors,{
  
  origin: '*',
})
async function clearMysql() {
  try {
    await sqlDBConnector.execute('DELETE FROM recipe_ingredient');
    await sqlDBConnector.execute('DELETE FROM recipes');
    await sqlDBConnector.execute('DELETE FROM ingredients');
    console.log('Mysql collections have been cleared');
} catch (error) {
    console.error('Failed to clear Mysql collections:', error);
}
}
async function clearMongoDB() {
try {

    await Recipe.deleteMany({});
    console.log('MongoDB collections have been cleared');
} catch (error) {
    console.error('Failed to clear MongoDB collections:', error);
}
}
clearMongoDB()
clearMysql()
  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    // Server is now listening on ${address}
  })