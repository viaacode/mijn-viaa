var express = require('express');
var router = express.Router();
var path = require("path");
var ejs = require("ejs");

var displayRoutes = [
  {title: 'stats', url: '/api/stats'},
  {title: 'services', url: '/api/services/MAM'},
  {title: 'reports', url: '/api/reports/items-last-month'}
];

function showDocumentation (req, res, next) {
  var data = {
    routes: displayRoutes
  };
  ejs.renderFile(__dirname + '/documentation.ejs', data, {delimiter: "%"}, function (err, str) {
    if (err) return next(err);
    res.send(str);
  });
}

router.get('/', showDocumentation);

router.get('/api/', showDocumentation);

// Return router
module.exports = router;
