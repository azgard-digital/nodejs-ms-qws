const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf');

const indexRouter = require('./routes/index');
const productsRouter = require('./routes/products');
const basketRouter = require('./routes/basket');
const orderRouter = require('./routes/order');
require('dotenv').config();
const {connection, query} = require('./libs/mysql_connection');
const redis = require('redis');
const session = require('express-session');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({host: process.env.REDIS_HOST})

app.use(
    session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.db = query
  next()
})

app.use(cookieParser());
app.use(csrf({ cookie: true }))
const csrfProtection = csrf({ cookie: true });

app.use('/', indexRouter);
app.use('/products', productsRouter);
app.use('/basket', basketRouter);
app.use('/order', orderRouter);
app.get('/test',function(req,res){
    res.sendFile(path.join(__dirname+'/views/test.html'));
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
