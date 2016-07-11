var express = require('express');
var request = require('request');

var router = express.Router();

//region stats
/**
 * used in callback argument to return if successful
 * otherwise the error object/message is returned (not a falsy value)
 */
var NO_ERROR = '';

router.get('/stats/', function (req, res, next) {
  // todo: get organisationId from SAML
  var organisationId = 'VRT';
  fetchStats(organisationId, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

function fetchStats (organisation, callback) {

  var url = 'http://labs.viaa.be/api/v1/archived?tenant=' + organisation;

  request(url, function (error, response, body) {
    if (error) return callback(error);
    if (response.statusCode != 200) return callback('Statuscode: ' + response.statusCode);

    console.log(obj);
    var obj = parseStats(JSON.parse(body));
    callback(NO_ERROR, obj);
  });
}

function parseStats (inputObject) {
  return {
    terabytes: inputObject.response.data.archived.terabytes,
    items: inputObject.response.data.archived.all,
    archive_growth: 111.12,
    registration_growth: 111.5
  };
}
//endregion

//region services
router.get('/services/:serviceId', function (req, res, next) {
  var serviceId = req.params.serviceId;
  res.json({
    service: serviceId
  });
});
//endregion

//region reports
router.get('/reports/:reportId', function (req, res, next) {
  var reportId = req.params.reportId;
  res.json({
    report: reportId
  });
});
//endregion

// Return router
module.exports = router;
