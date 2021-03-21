const express = require('express');
const router = express.Router();
const Controller = require('../controllers/productController');
const HttpError = require('../errors/http').HttpError;

/* GET products listing. */
router.get('/', async function (req, res) {
    try {
        const controller = new Controller(req.db);
        res.status(200).json(await controller.getDailyProducts());
    } catch (e) {
        if (e instanceof HttpError) {
            throw e;
        } else {
            console.error(e);
            throw new HttpError(422, 'Unprocessable Entity');
        }
    }
});

module.exports = router;
