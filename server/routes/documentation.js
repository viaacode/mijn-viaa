var path = require("path");
var ejs = require("ejs");

module.exports = function (app) {
  var displayRoutes = [
    {title: 'stats', url: '/api/stats'},
    {title: 'services', url: '/api/services/MAM'},
    {title: 'reports', url: '/api/reports/items/last-month'}
  ];

  function showDocumentation (req, res, next) {
    res.render('documentation', {
      routes: displayRoutes
    });
  }

  app.get('/', showDocumentation);

  app.get('/api/', showDocumentation);
};
