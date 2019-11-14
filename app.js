var express = require('express');
var favicon = require('serve-favicon');
var dotenv = require('dotenv').config();
var path = require('path');
var bodyParser = require('body-parser');

// Routes
var index = require('./routes/index');
var app = express();

// Favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// view engine setup    
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serving of static files in Express
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

// Sets up express.router to intercept all incoming traffic
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;

    // Whipe the stack trace if production
    res.locals.error = req.app.get('env') === 'development' ? err : {
        status: "",
        stack: ""};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
