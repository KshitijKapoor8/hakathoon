const cheerio = require('cheerio');
const router = require('express').Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');
let Pr = require('../models/product.model.js');
const { inflateRaw } = require('zlib');


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
    
      // console.log('products:' + link);
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
    let score = 0;

    searchLink = page.url();
      // Wait for the JavaScript on the page to finish executing
    
      // Get the updated HTML
      
      if(searchLink.includes("unilever") || searchLink.includes("pg")) {
        await page.waitForSelector('#ingredient-list ul a');
        html = await page.content();
        const $ = cheerio.load(html);
        $('#ingredient-list ul a').each((index, element) => {
          const ingredient = $(element).text().trim();
          ingredients.push(ingredient);
        });
      } else if(searchLink.includes("rbna")) {
        await page.waitForSelector('#ingredients h4.card-title h3');
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

          var b = {}

          ingredients.forEach((i) => {
            
          });



          // Create items array
          var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
          });

          // Sort the array based on the second element
          items.sort(function(first, second) {
            return second[1] - first[1];
          });

          // Create a new array with only the first 5 items
          console.log(items.slice(0, 5));
      })
    } 
    else {
      console.log("none")
    }

    
    
      await browser.close();

      function similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
          longer = s2;
          shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength == 0) {
          return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
      }

      function editDistance(s1, s2) {
        s1 = s1.toLowerCase();
        s2 = s2.toLowerCase();
      
        var costs = new Array();
        for (var i = 0; i <= s1.length; i++) {
          var lastValue = i;
          for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
              costs[j] = j;
            else {
              if (j > 0) {
                var newValue = costs[j - 1];
                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                  newValue = Math.min(Math.min(newValue, lastValue),
                    costs[j]) + 1;
                costs[j - 1] = lastValue;
                lastValue = newValue;
              }
            }
          }
          if (i > 0)
            costs[s2.length] = lastValue;
        }
        return costs[s2.length];
      }
      

      fs.readFile('output.json', 'utf8', (err, data) => {
          if (err) throw err;
      
          // Parse the JSON data into a JavaScript object
          const obj = JSON.parse(data);
          var l = Object.keys(obj).length;

          

          let c = 0;
          let d = 0;
          for (let i = 0; i < ingredients.length; i++) {
            for (let j = 0; j < l; j++) {
              if(similarity(ingredients[i], Object.keys(obj)[j]) > 0.9) {
                c++;
                d += Object.values(obj)[j];
              }
            }
          }
          
          let score = d / c;
          score = Math.round(score * 100) / 100;
          console.log(score);


          
          const newPr = new Pr({name, ingredients, score, link});
          newPr.save()
              .then(() => {res.json(newPr)})
              .catch((err) => {res.status(400).json("Error: "+ err)})
          //console.log(obj);
      });
              
      
    })(); 
      


})

module.exports = router;