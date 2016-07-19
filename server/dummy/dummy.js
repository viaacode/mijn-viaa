var fs = require("fs");
var path = require("path");
var moment = require("moment");

var DATE_FORMAT = 'YYYY-MM-DD HH:mm:';

var statsJson = fs.readFileSync(path.join(__dirname + '/stats.json'));
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
  var data = '{}';
  var response = {statusCode: 200};
  var error = null;

  var reportsOptions = {
    y: '',
    reportType: '',
    begin: '',
    end: '',
    gran: ''
  };

  var parts = url.split('/');

  var i;
  if ((i = parts.indexOf('stats')) >= 0) {
    return statsJson;
    return callback(error, response, data);
  } else if ((i = parts.indexOf('reports')) >= 0) {
    console.log(parts[i]);
    console.log(parts[i + 1]);
    console.log(parts[i + 2]);

    reportsOptions.y = parts[i + 1];
    reportsOptions.reportType = parts[i + 2];

    data = generateReports(reportsOptions);
  } else if ((i = parts.indexOf('services')) >= 0) {
    console.log(parts[i]);
    console.log(parts[i + 1]);

    data = JSON.parse(servicesJson)[parts[i + 1]];
  }

  return callback(error, response, data);
}

var DUMMY = {
  services: JSON.parse(servicesJson),
  reports: JSON.parse(reportsJson),
  request: request,
  reportsGeneration: generateReports
};

module.exports = DUMMY;
