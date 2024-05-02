import Fastify from 'fastify'
import recipesRoutes from './src/routes/recipeRoutes.js'
const fastify = Fastify({
  logger: true
})

fastify.register(recipesRoutes)

  fastify.listen({ port: 3000 }, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    // Server is now listening on ${address}
  })