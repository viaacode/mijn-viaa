var fs = require("fs");
var path = require("path");

var servicesJson = fs.readFileSync(path.join(__dirname + '/services.json'));
var reportsJson = fs.readFileSync(path.join(__dirname + '/reports.json'));

var DUMMY = {
  services: JSON.parse(servicesJson),
  reports: JSON.parse(reportsJson)
};

module.exports = DUMMY;
