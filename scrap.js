import puppeteer from "puppeteer";
import { createRecipe } from "./src/controllers/recipeController.js";
import * as fs from "fs"
import { error } from "console";


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
