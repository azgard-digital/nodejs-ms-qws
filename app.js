const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const csrf = require('csurf');
const HttpError = require('./errors').HttpError;

require('dotenv').config();
const {connection, query} = require('./libs/mysqlConnection');
const redis = require('redis');
const session = require('express-session');
const helmet = require('helmet');

const app = express();

require('./routes')(app);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient({host: process.env.REDIS_HOST})

app.use(helmet());
app.use(
    session({
        store: new RedisStore({client: redisClient}),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    req.db = query
    next()
})

app.use(cookieParser());
app.use(csrf({cookie: true}))
const csrfProtection = csrf({cookie: true});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    let err = new HttpError(404, "Page Not Found");
    next(err);
});

// error handler
app.use(function(err, req, res, next) {

    err = req.app.get('env') === 'dev' ? err : {};
    // render the error page
    res.status(err.status || 500);

    if (res.req.headers['x-requested-with'] == 'XMLHttpRequest') {
        res.json(err);
        return;
    }

    if (err.status == 404) {
        res.sendFile(path.join(__dirname, '/views', '404.html'));
        return;
    }

    res.sendFile(path.join(__dirname, '/views', '500.html'));
});

module.exports = app;
