


export  async function index (req,rep){

  const recipes = await this.recipeService.index();
rep.send( recipes)
}
export  async function getRecipeByName (req,rep){
  try {

    const recipes = await this.recipeService.getRecipeByName(req.params.name);

    rep.send( recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
  }

}

export  async function getRecipeByIngredient (req,rep){
  try {

    const recipes = await this.recipeService.getRecipeByIngredient(req.params.ingredient);
    rep.send( recipes);
  } catch (error) {
    console.error('Error searching recipes:', error);
  }

}
export async function getRecipeById(req, res) {
  try {
    const { id } = req.params; // Extract the ID from request parameters
    const recipe = await this.recipeService.getRecipeById(id); // Call the service method passing the ID

    if (!recipe) {
      return res.status(404).send({ message: 'Recipe not found' }); // Send 404 if no recipe is found
    }

    res.send(recipe); // Send the recipe to the client
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    res.status(500).send({ error: 'An error occurred while fetching the recipe' }); // Handle errors and send a response
  }
}
