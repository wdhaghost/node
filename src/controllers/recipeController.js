import fastify from "fastify"
export  async function index (req,rep){


   return {data:'recipes'}
}
export  async function getRecipeByName (req,rep){

   return {recette:req.params.name}
}

export  async function getRecipeByIngredient (req,rep){
   return {ingredients:req.params.ingredient}

}
