import { mongoRecipe as Recipe } from "../models/mongoRecipe.js";

class MongoRecipeRepository {
    async index() {
        return await Recipe.find();
    }

    async findById(id) {
        return await Recipe.findById(id);
    }
    async findByName(name) {
        const regex = new RegExp(name, 'i'); // 'i' for case insensitive
        const recipes = await Recipe.find({ name: regex });
        return recipes;
    }
    async findByIngredient(ingredient) {
        const regex = new RegExp(ingredient, 'i'); // 'i' for case insensitive
        const recipes = await Recipe.find({ ingredients: regex });
        return recipes;
    }
}
export default MongoRecipeRepository;
