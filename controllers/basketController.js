const ProductModel = require('../models/Product')
const prefix = 'product_'

class BasketController {
    #entity;

    constructor(builder) {
        this.#entity = new ProductModel(builder);
    }

    async all(products) {
        const ids = [];
        const basketProducts = [];

        for (let index in products) {
            ids.push(products[index].product_id);
        }

        for (let product of await this.#entity.getBasketProducts(ids)) {
            const index = prefix + product.id;
            product.count = products[index].count;
            basketProducts.push(product);
        }

        return basketProducts;
    }

    add(products, addedProduct) {

        if (Object.keys(products).length !== 0 && prefix + addedProduct in products) {
            const index = prefix + addedProduct;
            products[index].count += 1;
        } else {
            let index = prefix + addedProduct;
            products[index] = {count: 1, product_id: addedProduct};
        }

        return products;
    }

    delete(products, removedProduct) {

        if (Object.keys(products).length !== 0 && prefix + removedProduct in products) {
            const index = prefix + removedProduct;

            if (products[index].count > 1) {
                products[index].count -= 1;
            } else {
                delete products[index];
            }
        }

        return products;
    }
}

module.exports = BasketController;