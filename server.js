import Fastify from 'fastify'
import recipesRoutes from './src/routes/recipeRoutes.js'
import dbConnector from './src/db/dbConnector.js'
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from '@fastify/cors';


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

fastify.register(fastifySwagger, swaggerOptions);
fastify.register(fastifySwaggerUi, swaggerUiOptions);
fastify.register(dbConnector)

fastify.register(recipesRoutes)
fastify.register(fastifyCors,{
  origin: true
})
  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    // Server is now listening on ${address}
  })