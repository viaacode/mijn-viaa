var path = require("path");
var ejs = require("ejs");

module.exports = function (app) {
  var displayRoutes = [
    {title: 'stats', url: '/api/stats'},
    {title: 'reports', url: '/api/reports/items/last-month'},
    {title: 'mule test', url: '/api/mule-test'}
  ];

  function showDocumentation (req, res, next) {
    res.render('documentation', {
      routes: displayRoutes
    });
  }

  app.get('/api/', showDocumentation);
};
