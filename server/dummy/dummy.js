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

// helper method
function reportsGenerationOptions (y, type) {
  var options = {
    y: y,
    reportType: type,
    begin: moment(new Date()),
    end: '',
    gran: ''
  };

  switch (options.reportType) {
    case 'last-week':
      options.gran = 'day';
      options.begin = options.begin.startOf(options.gran).subtract(1, 'week');
      break;

    case 'last-month':
      options.gran = 'day';
      options.begin = options.begin.startOf(options.gran).subtract(1, 'month');
      break;

    case 'last-year':
      options.gran = 'month';
      options.begin = options.begin.startOf(options.gran).subtract(1, 'year');
      break;
  }

  options.begin = options.begin.format(DATE_FORMAT);
  return options;
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

  var parts = url.split('?')[0].split('/');

  var i;
  if ((i = parts.indexOf('stats')) >= 0) {
    data = statsJson;
  } else if ((i = parts.indexOf('reports')) >= 0) {
    var y = parts[i + 1];
    var type = parts[i + 2];
    var options = reportsGenerationOptions(y, type);
    options.data = generateReports(options);
    data = options;
  } else if ((i = parts.indexOf('services')) >= 0) {
    var serviceName = parts[i + 1];
    console.log('services+0' + parts[i]);
    console.log('services+1' + serviceName);

    data = JSON.parse(servicesJson)[serviceName];
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
