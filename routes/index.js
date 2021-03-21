const indexRouter = require('./base');
const productsRouter = require('./products');
const basketRouter = require('./basket');
const orderRouter = require('./order');

function routes(app) {
    app.use('/', indexRouter);
    app.use('/products', productsRouter);
    app.use('/basket', basketRouter);
    app.use('/order', orderRouter);
}

module.exports = routes;
