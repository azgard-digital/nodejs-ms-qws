const HttpError = require('../errors/http').HttpError;

class Product {
    #db;

    constructor(db) {
        this.#db = db;
    }

    async getDailyProducts() {
        const today = new Date().toISOString().slice(0, 10);

        try {
            return await this.#db(`select dp.id, dp.discount_price, dp.price, p.link, p.image, p.name
                            from daily_products as dp
                            join products as p on p.id = dp.product_id
                            where DATE(dp.added_time) = ?    
                            order by dp.added_time desc`, [today]);
        } catch (e) {
            console.error(e);
            throw new HttpError(500, 'Server error');
        }
    }

    async getBasketProducts(ids) {
        try {
            return await this.#db(`select dp.id, dp.discount_price, dp.price, p.link, p.image, p.name
                            from daily_products as dp
                            join products as p on p.id = dp.product_id
                            where dp.id IN(?)`, [ids.join(',')])
        } catch (e) {
            console.error(e);
            throw new HttpError(500, 'Server error');
        }
    }
}

module.exports = Product