var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Express
var app = express();

// Morgan to log requests
app.use(logger('dev'));

app.use(bodyParser.json());

// Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));

// Error handling
app.use(function (err, req, res, next) {
  //Only print stacktrace when in a dev environment
  var stackTrace = {};
  if (app.get('env') === 'development') {
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

module.exports = app;
