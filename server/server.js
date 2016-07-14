var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
var request = require('request');

var allowCors = require('./config/cors');
var authMiddleware = require('./config/authentication-middleware');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')(env);

// Express
var app = express();

app.set('port', config.app.port);
// app.set('views', __dirname + '/app/views');
app.set('view engine', 'ejs');
app.use(allowCors);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.app.sessionSecret
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
require('./routes/documentation')(app, config);

// Routes for API
var apiRouter = express.Router();
if (config.passport) {
  apiRouter.use(authMiddleware.errorCode);
}

require('./routes/api')(apiRouter, config, request);
app.use('/', apiRouter);

// Error handling
app.use(function (err, req, res, next) {
  //Only print stacktrace when in a dev environment
  var stackTrace = {};
  if (config.showErrors) {
    stackTrace = err;
  }

  console.error(err);
  res.status(500).send({
    status: 500,
    message: err.message,
    error: stackTrace,
    type: 'internal'
  });
});

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
