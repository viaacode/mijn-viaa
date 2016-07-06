var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.send('For api requests: /api/');
});

// Return router
module.exports = router;
