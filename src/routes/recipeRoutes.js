import { getRecipeByIngredient, getRecipeByName,index} from '../controllers/recipeController.js'
 export default async function recipesRoutes (fastify,options){
    fastify.get('/',index)
    fastify.get('/recipes/:name',getRecipeByName)
    fastify.get('/recipes/ingredient/:ingredient',getRecipeByIngredient)

}

