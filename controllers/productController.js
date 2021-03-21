const ProductModel = require('../models/Product')

class ProductController {
    #entity;

    constructor(builder) {
        this.#entity = new ProductModel(builder);
    }

    async getDailyProducts() {
        return await this.#entity.getDailyProducts();
    }
}

module.exports = ProductController;