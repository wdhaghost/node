import fastify from "fastify";

class SQLRecipeRepository {
    constructor(db) {
        this.db = db;
    }

    async index() {
     const [recipes]= await this.db.execute('SELECT * FROM recipes');
     for (const recipe of recipes){
         const [ingredients] = await this.db.execute('SELECT name FROM ingredients JOIN recipe_ingredient ON ingredients.id = recipe_ingredient.ingredient_id WHERE recipe_ingredient.recipe_id = ?', [recipe.id]);
         recipe.ingredients = ingredients.map(ingredient => ingredient.name);
        }
    return recipes;
    }
    
    async findById(id) {
        const [recipe] = await this.db.execute('SELECT * FROM recipes WHERE id = ?', [id]);
        if (recipe.length === 0) {
            return null;
        }
        const [ingredients] = await this.db.execute('SELECT name FROM ingredients JOIN recipe_ingredient ON ingredients.id = recipe_ingredient.ingredient_id WHERE recipe_ingredient.recipe_id = ?', [id]);
        recipe[0].ingredients = ingredients.map(ingredient => ingredient.name);
        return recipe[0];
    }
    async findByName(name) {
        const [recipes] = await this.db.execute('SELECT * FROM recipes WHERE name LIKE ?', ['%'+name+'%']);
        for (const recipe of recipes) {
            const [ingredients] = await this.db.execute('SELECT name FROM ingredients JOIN recipe_ingredient ON ingredients.id = recipe_ingredient.ingredient_id WHERE recipe_ingredient.recipe_id = ?', [recipe.id]);
            recipe.ingredients = ingredients.map(ingredient => ingredient.name);
        }
        return recipes;
    }
    async findByIngredient(ingredient) {
        const [recipes] = await this.db.execute('SELECT recipes.id,recipes.name,recipes.steps FROM recipes JOIN recipe_ingredient ON recipes.id = recipe_ingredient.recipe_id JOIN ingredients ON ingredients.id = recipe_ingredient.ingredient_id WHERE ingredients.name LIKE ?', ['%'+ingredient+'%']);
        for (const recipe of recipes) {

            const [ingredients] = await this.db.execute('SELECT name FROM ingredients JOIN recipe_ingredient ON ingredients.id = recipe_ingredient.ingredient_id WHERE recipe_ingredient.recipe_id = ?', [recipe.id]);
            recipe.ingredients = ingredients.map(ingredient => ingredient.name);
        }
        return recipes;
    }

}
export default SQLRecipeRepository;