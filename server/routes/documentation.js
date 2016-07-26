var path = require("path");
var ejs = require("ejs");

var flattenObject = require('../util/flatten-object');

module.exports = function (app, config) {

  var findRoutes = flattenObject(function (key, value) {
    return {
      localPath: {
        title: key,
        url: key,
        extra: ''
      },
      toEndpoint: {
        title: config.mule.host + value,
        url: config.mule.host + value,
        extra: config.dummyRequest ? '(mocked with dummy data)' : ''
      }
    };
  });

  var routes = findRoutes('/api', config.mule.endpoints, []);

  function showDocumentation (req, res, next) {
    res.render('documentation', {
      routes: routes
    });
  }

  app.get('/api/', showDocumentation);
};
