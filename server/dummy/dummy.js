var fs = require("fs");
var path = require("path");
var moment = require("moment");

var DATE_FORMAT = 'YYYY-MM-DD HH:mm:';

var servicesJson = fs.readFileSync(path.join(__dirname + '/services.json'));
var reportsJson = fs.readFileSync(path.join(__dirname + '/reports.json'));

/**
 *
 * @param options {
 *   y: 'items',
 *   reportType: 'last-month',
 *   begin: '',
 *   end: '',
 *   gran: ''
 * };
 */
function generateReports (options) {
  var data = [];

  var begin = moment(options.begin, DATE_FORMAT);
  var end = options.end ? moment(options.end, DATE_FORMAT) : moment();

  var random = getRandomFunction(options);

  for (var m = moment(begin); m.isBefore(end); m.add(1, options.gran)) {
    data.push({
      timestamp: m.unix(),
      value: random()
    });
  }

  return data;
}

function getRandomFunction (options) {
  var max = 300;

  switch (options.y) {
    case 'items':
      return function () {
        return Math.floor(Math.random() * max);
      };
    default:
      return function () {
        return Math.random() * max;
      };
  }
}

var DUMMY = {
  services: JSON.parse(servicesJson),
  reports: JSON.parse(reportsJson),
  reportsGeneration: generateReports
};

module.exports = DUMMY;
