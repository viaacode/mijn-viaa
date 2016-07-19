var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');

var allowCors = require('./config/cors');
var authMiddleware = require('./config/authentication-middleware');
var delayMiddleware = require('./config/delay-middleware');

module.exports = function (config, request) {
  // Express
  var app = express();

  app.set('port', config.app.port);
  app.set('views', config.paths.app('views'));
  app.set('view engine', 'ejs');
  app.use(allowCors);
  app.use(morgan('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));
  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.app.sessionSecret
  }));
  app.use(passport.initialize());
  app.use(passport.session());

  // Routes
  require('./routes/documentation')(app, config);

  /* Routes for API */
  var apiRouter = express.Router();
  if (config.passport) {
    console.log('Authentication is ON');
    require('./routes/authentication')(app, config, passport);
    apiRouter.use('/api', authMiddleware.errorCode);
    app.use('/pages/*.html', authMiddleware.redirect);
  }

  if (config.apiDelay) {
    apiRouter.use('/api', delayMiddleware(config));
  }

  require('./routes/api')(apiRouter, config, request);
  app.use('/', apiRouter);

  /* Routes for front-end */
  require('./routes/service-available')(app, config);
  // temporary quick-fix, need to use a public folder in the future
  require('./routes/front-end')(app, config);
  app.use('/public', express.static(config.paths.app('public')));

  /* Error handling */
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

  return app;
};
