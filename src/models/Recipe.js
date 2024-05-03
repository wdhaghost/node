import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema({
    name:String,
    ingredients:Array,
    steps:Array
})

export const Recipe = mongoose.model('Recipe',recipeSchema)
// export default Recipe