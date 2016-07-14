var _ = require('underscore');

module.exports = function (req, res, next) {
  var min = 3; //seconds
  var max = 10; //seconds
  var duration = Math.floor(Math.random() * (max - min) + min);
  duration *= 1000;

  _.delay(function () {
    next();
  }, duration);
};
