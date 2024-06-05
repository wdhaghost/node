import fastifyPlugin from "fastify-plugin";
import mongoose from "mongoose";
async function mongoDBConnector(){
  await mongoose.connect(process.env.MONGO_DB_URL,{ serverSelectionTimeoutMS: 30000 })
  .then(() => {
      console.log('MongoDB connected successfully');
    }).catch(err => {
      console.error('MongoDB connection error:', err);
    });
    
 
}
export default fastifyPlugin(mongoDBConnector)