import fastifyPlugin from "fastify-plugin";
import fastifyMongo from "@fastify/mongodb";


async function dbConnector(fastify,options){
fastify.register(fastifyMongo,{
    url: process.env.MONGO_DB_URL
})
}
export default fastifyPlugin(dbConnector)