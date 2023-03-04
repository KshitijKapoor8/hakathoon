const cheerio = require('cheerio');
const router = require('express').Router();
const puppeteer = require('puppeteer');
const axios = require('axios');
let Pr = require('../models/product.model.js');


router.route('/').get((req, res) => {
  Pr.find()
    .then(prs => res.json(prs))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const score = req.body.score;
    const name = req.body.name;
    const link = req.body.link;

    const ingredients = [];

    (async () => {

      const browser = await puppeteer.launch();
      const page = await browser.newPage();
    
      await page.goto(link);

      await page.waitForSelector('#productTitle');
      var html = await page.content();
      var title = cheerio.load(html)("#productTitle").text();  

      var y = "https://smartlabel.org/product-search/?product=";
      let validLetters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*_-";
      title = title.trim();
      console.log(title);
      String(title).split(" ").forEach((word) => {        
        word.split("").forEach((letter) => {
          if(!validLetters.includes(letter)) {
            y += letter.charCodeAt(0);
          } else {
            y += letter;
          }
        })
        y += "+"
      })
      console.log(y);
      page.close();
      page = await browser.newPage();
    
      await page.goto(link);
    
      // Wait for the JavaScript on the page to finish executing
      await page.waitForSelector('.fren-ing');
    
      // Get the updated HTML
      html = await page.content();
      const $ = cheerio.load(html);
      $('span.fren-ing').each((index, element) => {
        console.log("element:" + element)
        const ingredient = $(element).text();
        ingredients.push(ingredient);
      });
      
      // Do something with the HTML
      console.log(ingredients);
    
      await browser.close();

      const flags = req.body.flags;
    

      const newPr = new Pr({name, ingredients, score, flags, link});
      newPr.save()
          .then(() => {res.json("Product added!")})
          .catch((err) => {res.status(400).json("Error: "+ err)})
    })(); 
      


})

module.exports = router;