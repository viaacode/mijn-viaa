var _ = require('underscore');

module.exports = function (config) {
  return function (req, res, next) {
    var min = config.min || 3; //seconds
    var max = config.max || 10; //seconds
    var duration = Math.floor(Math.random() * (max - min) + min);
    duration *= 1000;

    _.delay(next, duration);
  };
};