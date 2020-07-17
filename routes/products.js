const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Products')
/* GET products listing. */
router.get('/', async function(req, res) {
  const model = new ProductModel(req.db)
  const products = await model.getDailyProducts()
  res.send(JSON.stringify(products));
});

module.exports = router;
