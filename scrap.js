import puppeteer from "puppeteer";
import { mongoRecipe as Recipe } from "./src/models/mongoRecipe.js";
import dotenv from 'dotenv';
import * as fs from "fs"
import { v4 as uuidv4 } from "uuid";
import mysql from 'mysql2/promise';
import mongoose from "mongoose";
dotenv.config();

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

const connection = await mysql.createConnection({
    host: process.env.SQL_DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.SQL_DB_USER,
    password: process.env.SQL_DB_PW,
    database: process.env.SQL_DB_NAME,
  });
  
  async function clearMysql() {
      try {
        await connection.execute('DELETE FROM recipe_ingredient');
        await connection.execute('DELETE FROM recipes');
        await connection.execute('DELETE FROM ingredients');
        console.log('Mysql collections have been cleared');
    } catch (error) {
        console.error('Failed to clear Mysql collections:', error);
    }
}
async function clearMongoDB() {
    try {
        // Assuming you have models like Recipe and Ingredient
        await Recipe.deleteMany({});
        console.log('MongoDB collections have been cleared');
    } catch (error) {
        console.error('Failed to clear MongoDB collections:', error);
    }
}



async function insertRecipe(data) {
    const id = uuidv4();  // Generate a UUID

    const mongoRecipe = new Recipe({_id: id, ...data});
    await mongoRecipe.save();
  
    const { name, steps,ingredients } = data;
    await connection.execute('INSERT INTO recipes (id, name, steps) VALUES (?, ?, ?)', [id, name, steps]);
    for (const ingredient of ingredients) {
        let ingredientId;

        const [rows] = await connection.execute('SELECT id FROM ingredients WHERE name = ?', [ingredient]);
        if (rows.length > 0) {
            ingredientId = rows[0].id;  
        } else {

            const result = await connection.execute('INSERT INTO ingredients (name) VALUES (?)', [ingredient]);
            ingredientId = result[0].insertId;  // Get the auto-generated ID from the insert operation
        }

        // Link the recipe and ingredient by their IDs
        await connection.execute('INSERT INTO recipe_ingredient (recipe_id, ingredient_id) VALUES (?, ?)', [id, ingredientId]);
    }


  }
async function scrapeAllCategories(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.allrecipes.com/recipes-a-z-6735880', {waitUntil: 'domcontentloaded'});

    const categories = await page.evaluate(() => {
        const categoriesList = document.querySelectorAll('.mntl-link-list__link');
        return Array.from(categoriesList).map(category => category.href);
    });

    await browser.close();
    return categories;
}

async function fetchRecipe(href, browser){
    const page = await browser.newPage();
    await page.goto(href, {waitUntil: 'domcontentloaded'});

    const recipe = await page.evaluate(() => {
        const name = document.querySelector('h1').innerText;
        const ingredients = Array.from(document.querySelectorAll(".mntl-structured-ingredients__list-item > p")).map(ingr => ingr.innerText);
        const steps = Array.from(document.querySelectorAll('div.recipe__steps-content > ol > li > p')).map(step => step.innerText);
        return { name, ingredients, steps }
    });
    
    await page.close();
    await insertRecipe(recipe)
    return recipe
    
}

async function fetchAllRecipes(href){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(href, {waitUntil: 'domcontentloaded'});
    let recipesList=[]
    const recipes = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.comp.tax-sc__recirc-list.card-list.mntl-universal-card-list.mntl-document-card-list.mntl-card-list.mntl-block > .comp.mntl-card-list-items.mntl-document-card.mntl-card.card--no-image')).map(a => a.href);
    });

    for (const recipeHref of recipes) {
       const recipe= await fetchRecipe(recipeHref, browser); 
        recipesList.push(recipe)
    }

    await browser.close(); 
    return recipesList
}

// Example usage
async function main() {
    try{
        await clearMongoDB();
        await clearMysql();
        const categories = await scrapeAllCategories();
        const recipes=await fetchAllRecipes("https://www.allrecipes.com/recipes/343/bread/quick-bread/fruit-bread/banana-bread/");

        fs.writeFile("data.json",JSON.stringify(recipes),(error)=>{
            if (error) {
                console.error(error)
            }
        })
    }catch(error){
        console.log(error)
    }
}

main();
