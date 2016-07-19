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

/**
 *
 * @param url
 * @param callback function (error, response, body)
 */
function request (url, callback) {
  var reportsOptions = {
    y: '',
    reportType: '',
    begin: '',
    end: '',
    gran: ''
  };

  switch (url) {
    default:
      reportsOptions.y = 'items';
      reportsOptions.reportType = 'last-month';
      var data = generateReports(reportsOptions);
      data = {};
      var response = {statusCode: 200};
      var error = null;
      return callback(error, response, data);
  }
}

var DUMMY = {
  services: JSON.parse(servicesJson),
  reports: JSON.parse(reportsJson),
  request: request,
  reportsGeneration: generateReports
};

module.exports = DUMMY;
