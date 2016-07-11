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
  res.render('documentation', {
    routes: displayRoutes
  });
}

router.get('/', showDocumentation);

router.get('/api/', showDocumentation);

// Return router
module.exports = router;
