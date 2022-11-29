// For image uploading 
// https://www.geeksforgeeks.org/upload-and-retrieve-image-on-mongodb-using-mongoose/

require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require("express-session");
var logger = require('morgan');
var favicon = require("serve-favicon")
var initializeMongoServer = require('./mongoConfig')
var passportInit = require('./passportConfig')
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");
const flash = require('express-flash')

var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();

//favicon 
app.use(favicon(path.join(__dirname,'public','images','favicon.ico')))
// view engine setup
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

let key = ''
if (process.env.SECRET){
  key=process.env.SECRET
}
else {
  key= process.env.key
}

app.use(session({ secret: key, resave: false, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression());
app.use(helmet());
app.use(flash())
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//database 

initializeMongoServer()
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
  res.render('error');
});

passportInit()


module.exports = app;
