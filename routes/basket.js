const express = require('express')
const router = express.Router()
const HttpError = require('../errors/http').HttpError;
const Controller = require('../controllers/basketController')

router.get('/', async function (req, res) {
    const products = req.session.products

    if (!products || !Object.keys(products).length) {
        throw new HttpError(422, 'Unprocessable Entity');
    }

    try {
        const controller = new Controller(req.db);
        res.status(200).json(await controller.all(products));
    } catch (e) {
        if (e instanceof HttpError) {
            throw e;
        } else {
            console.error(e);
            throw new HttpError(422, 'Unprocessable Entity');
        }
    }
})

router.post('/', function (req, res) {
    try {
        let products = req.session.products || {};
        const addedProduct = req.body.added_product;

        const controller = new Controller(req.db);
        req.session.products = controller.add(products, addedProduct);
        req.session.save()
        res.status(200).json({status: 'success'});
    } catch (e) {
        if (e instanceof HttpError) {
            throw e;
        } else {
            console.error(e);
            throw new HttpError(422, 'Unprocessable Entity');
        }
    }
});

router.delete('/', function (req, res) {
    try {
        let products = req.session.products || {};
        const removedProduct = req.body.removed_product;

        const controller = new Controller(req.db);
        req.session.products = controller.delete(products, removedProduct);
        req.session.save()
        res.status(200).json({status: 'success'});
    } catch (e) {
        if (e instanceof HttpError) {
            throw e;
        } else {
            console.error(e);
            throw new HttpError(422, 'Unprocessable Entity');
        }
    }
});

module.exports = router
