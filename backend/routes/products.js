const cheerio = require('cheerio');
const router = require('express').Router();
const puppeteer = require('puppeteer');
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
      await page.waitForSelector('[xml\\:id="productTitle"');

    
      // Wait for the JavaScript on the page to finish executing
      await page.waitForSelector('.fren-ing');
    
      // Get the updated HTML
      const html = await page.content();
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