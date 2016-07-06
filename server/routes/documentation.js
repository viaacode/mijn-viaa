var express = require('express');
var router = express.Router();
var path = require("path");

router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/documentation.html'));
});

router.get('/api/', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/documentation.html'));
});

// Return router
module.exports = router;
