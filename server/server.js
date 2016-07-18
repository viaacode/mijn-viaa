var configEnvironments = require('./config/config');

var env = process.env.NODE_ENV || 'development';
var config = configEnvironments(env);

var app = require('./app')(config);

// Start server
app.listen(config.app.port, function () {
  console.log('--' + config.app.name + ' API available on port ' + config.app.port);
});
