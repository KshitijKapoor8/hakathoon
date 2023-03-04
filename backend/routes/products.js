const cheerio = require('cheerio');
const router = require('express').Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const ingData = require('../scraper.js');
const fs = require('fs');
let Pr = require('../models/product.model.js');


router.route('/').get((req, res) => {
  Pr.find()
    .then(prs => res.json(prs))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const score = req.body.score;
    var name = ""
    const link = req.body.link;
    const ingredients = [];

    (async () => {

      const browser = await puppeteer.launch({});
      var page = await browser.newPage();
    
      console.log('products:' + link);
      await page.goto(link);
      await page.waitForSelector('#productTitle');
      var html = await page.content();
      var title = cheerio.load(html)("#productTitle").text();  

      var searchLink = "https://smartlabel.org/product-search/?product=";
      let validLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*_-";
      title = title.trim();
      name = title;
      String(title).split(" ").forEach((word) => {        
        word.split("").forEach((letter) => {
          if(!validLetters.includes(letter)) {
            searchLink += letter.charCodeAt(0);
          } else {
            searchLink += letter;
          }
        })
        searchLink += "+"
      })

      await page.goto(searchLink);
      const openFirstProductSelector = '#search-results > table > tr > td > a'
      await page.waitForSelector(openFirstProductSelector);
      const [newPage] = await Promise.all([
        new Promise(resolve => page.once('popup', resolve)),
        page.click(openFirstProductSelector),
    ]);
    
    page = newPage;

    searchLink = page.url();
      // Wait for the JavaScript on the page to finish executing
      // await page.waitForSelector('#ingredient-list');
    
      // Get the updated HTML
      
      if(searchLink.includes("unilever") || searchLink.includes("pg")) {
        html = await page.content();
        const $ = cheerio.load(html);
        $('#ingredient-list ul a').each((index, element) => {
          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });
      } else if(searchLink.includes("rbna")) {
        html = await page.content();
        const $ = cheerio.load(html);
        $('#ingredients h4.card-title h3').each((index, element) => {
          var ingredient = $(element).text();
          if(!(ingredient.includes("INTENTIONALLY ADDED") || 
             ingredient.includes("NON-FUNCTIONAL CONSTITUENT") ||
             ingredient.includes("ACTIVE") ||
             ingredient.includes("FRAGRENCE COMPONENT"))) {
              if(ingredient.includes(".")) {
                ingredient = ingredient.substring(0, ingredient.indexOf("."))
              }
              ingredient = ingredient.trim();
              ingredients.push(ingredient);
             }
          
        });
      } 
      else if(searchLink.includes("labelinsight")) {
        await page.waitForSelector('#app > div > div.IngredientList__Container-s1okj7nk-1.fOlUYP > div.List-s4yj22t-0.iOrnUH > a');
        html = await page.content();
        const $ = cheerio.load(html);
        $('#app > div > div.IngredientList__Container-s1okj7nk-1.fOlUYP > div.List-s4yj22t-0.iOrnUH > a')
        .each((index, element) => {
          var ingredient = $(element).text();
          ingredient = ingredient.trim();
          ingredients.push(ingredient);
      })
    } 
    else {
      console.log("none")
    }

    
    
      await browser.close();
      
      const newPr = new Pr({name, ingredients, score, link});
      newPr.save()
          .then(() => {res.json(newPr)})
          .catch((err) => {res.status(400).json("Error: "+ err)})
    })(); 
      


})

module.exports = router;