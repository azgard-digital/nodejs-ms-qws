class Products {
    #db = null

    constructor(db) {
        this.#db = db
    }

    async getDailyProducts() {
        let data = []
        const today = new Date().toISOString().slice(0, 10)

        try {
            data = await this.#db(`select dp.id, dp.discount_price, dp.price, p.link, p.image, p.name
                            from daily_products as dp
                            join products as p on p.id = dp.product_id
                            where DATE(dp.added_time) = ?    
                            order by dp.added_time desc`, [today])
        } catch (e) {
            console.log(e)
        }

        return data
    }

    async getBasketProducts(ids) {
        let data = []

        try {
            data = await this.#db(`select p.id, dp.discount_price, dp.price, p.link, p.image, p.name
                            from daily_products as dp
                            join products as p on p.id = dp.product_id
                            where dp.id IN(?)`, [ids.join(',')])
        } catch (e) {
            console.log(e)
        }

        return data
    }
}

module.exports = Products