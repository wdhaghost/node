class RecipeService {
    constructor(recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    async getRecipeById(id) {
        return await this.recipeRepository.findById(id);
    }
    async getRecipeByName(name) {
        // console.log(await this.recipeRepository.findByName(name))
        return await this.recipeRepository.findByName(name);
    }
    async getRecipeByIngredient(ingredient) {
        console.log(ingredient)
        return await this.recipeRepository.findByIngredient(ingredient);
    }
    async index() {
        return await this.recipeRepository.index();
    }
}

export default RecipeService; 