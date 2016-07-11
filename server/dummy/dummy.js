var fs = require("fs");
var path = require("path");

var servicesJson = fs.readFileSync(path.join(__dirname + '/services.json'));

var DUMMY = {
  services: JSON.parse(servicesJson)
};

module.exports = DUMMY;
