import fastify from "fastify"
import {Recipe} from "../models/Recipe.js"

export  async function index (req,rep){

  const recipes = await Recipe.find()
rep.send( recipes)
}
export  async function getRecipeByName (req,rep){
  try {
    const regex = new RegExp(req.params.name, 'i'); // 'i' for case insensitive
    const recipes = await Recipe.find({ name: regex });
    rep.send( recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
  }

}

export  async function getRecipeByIngredient (req,rep){
  try {
    const regex = new RegExp(req.params.ingredient, 'i'); // 'i' for case insensitive
    const recipes = await Recipe.find({ ingredients: regex });
    rep.send( recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
  }

}
export async function getRecipeById(req, res) {
  try {
    const { id } = req.params; // Extract the ID from request parameters
    const recipe = await Recipe.findById(id); // Use findById() to get the recipe

    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' }); // Send 404 if no recipe is found
    }

    res.send(recipe); // Send the recipe to the client
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    res.status(500).send({ error: 'An error occurred while fetching the recipe' }); // Handle errors and send a response
  }
}

export async function createRecipe (recipe) {
   try {
      const { name, ingredients, steps } = recipe;
      const newRecipe = new Recipe({name:name,ingredients:ingredients,steps:steps})
      newRecipe.save();
      console.log('Recipe created successfully:', newRecipe);

    } catch (error) {
      console.error('Error creating recipe:', error);
      throw error;  // Rethrow the error if you want to handle it further up the call stack
    }
}