const router = require('express').Router();
let Pr = require('../models/product.model.js');

router.route('/').get((req, res) => {
  Pr.find()
    .then(prs => res.json(prs))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const score = req.body.score;
    const name = req.body.name;
    const ingredients = req.body.ingredients;
    const flags = req.body.flags;

    const newPr = new Pr({name, ingredients, score, flags});
    newPr.save()
        .then(() => {res.json("Product added!")})
        .catch((err) => {res.status(400).json("Error: "+ err)})
})

module.exports = router;