var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/productRoutes');
var userRouter = require('./routes/userRoutes')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');


const mongoose = require('mongoose');
const dotenv = require('dotenv').config()

const { contentType } = require('express/lib/response');

mongoose.connect(process.env.DATABASE)
    .then(() => console.log("good"))
    .catch(() => console.log("not good"));



const jsforce = require("jsforce");
const conn = new jsforce.Connection({
    // you can change loginUrl to connect to sandbox or tprerelease env.
    loginUrl: "https://login.salesforce.com/"
});
// Log in with basic SOAP login (see documentation for other auth options)
if (conn) {
    console.log('salesforce connecte');
}
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,Content,Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();

})
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        'error': err.message
    })
});

module.exports = app;