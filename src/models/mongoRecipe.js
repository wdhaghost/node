import mongoose, { Schema } from "mongoose";
import { v4 } from "uuid";

const recipeSchema = new Schema({
    _id: { type: String, default: v4 },
    name:String,
    ingredients:Array,
    steps:Array
})

export const mongoRecipe = mongoose.model('Recipe',recipeSchema)
// export default Recipe