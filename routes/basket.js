const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Products')

router.get('/', async function(req, res, next) {
  let products = req.session.products;

  if (Array.isArray(products) && products.length > 0) {
    const model = new ProductModel(req.db);
    products = await model.getBasketProducts(products);
  }

  res.send(JSON.stringify(products));
})

router.post('/add', function(req, res, next) {
  let products = req.session.products;
  const {added_product} = req.body

  if (!Array.isArray(products)) {
    products = [];
  }

  products.push(added_product);
  req.session.products = products;
  req.session.save()
  res.send(JSON.stringify({status:'success'}));
});

router.post('/remove', function(req, res, next) {
  let products = req.session.products;
  const {removed_product} = req.body

  if (Array.isArray(products) && products.length > 0) {
    let index;

    if (index = products.indexOf(removed_product)) {
      array.splice(index, 1);
      req.session.products = products;
      req.session.save()
    }
  }

  res.send(JSON.stringify({status:'success'}));
});

module.exports = router;
