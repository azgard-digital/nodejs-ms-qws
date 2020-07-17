const express = require('express')
const router = express.Router()
const ProductModel = require('../models/Products')
const prefix = 'product_'

router.get('/', async function(req, res) {
  let products = req.session.products || {}

  if (Object.keys(products).length !== 0) {
    const model = new ProductModel(req.db)
    const ids = []

    for (let index in products) {
      ids.push(products[index].product_id)
    }
    const basketProducts = []

    for (let product of await model.getBasketProducts(ids)) {
      const index = prefix+product.id
      product.count = products[index].count
      basketProducts.push(product)
    }
    products = basketProducts
  }

  res.send(JSON.stringify(products))
})

router.post('/add', function(req, res) {
  let products = req.session.products || {}
  const {added_product} = req.body

  if (Object.keys(products).length !== 0 && prefix+added_product in products) {
    const index = prefix+added_product
    products[index].count += 1
  } else {
    let index = prefix+added_product
    products[index] = {count:1, product_id: added_product}
  }

  req.session.products = products
  req.session.save()
  res.send(JSON.stringify({status:'success'}))
});

router.post('/remove', function(req, res) {
  let products = req.session.products || {}
  const {removed_product} = req.body

  if (Object.keys(products).length !== 0 && prefix+removed_product in products) {
    const index = prefix+removed_product

    if (products[index].count > 1) {
      products[index].count -= 1
    } else {
      delete products[index]
    }
    req.session.products = products
    req.session.save()
  }

  res.send(JSON.stringify({status:'success'}))
});

module.exports = router
