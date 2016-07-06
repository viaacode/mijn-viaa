var express = require('express');
var request = require('request');

var router = express.Router();

//region Magical Numbers
// used in callback argument to return if successful
// otherwise the error object/message is returned (not a falsy value)
var SUCCESS = '';

// used to indicate that global stats of VIAA requested
var VIAA_STATS = '';
//endregion

router.get('/stats/', function (req, res, next) {
  fetchStats(VIAA_STATS, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

// todo: auth
router.get('/stats/organisation/:organisationId', function (req, res, next) {
  var organisationId = req.params.organisationId;
  fetchStats(organisationId, function (err, data) {
    if (err) return next(err);
    res.json(data);
  });
});

//region Helper methods
function fetchStats (organisation, callback) {

  var url = 'http://labs.viaa.be/api/v1/archived';

  if (organisation !== VIAA_STATS) {
    url += '?tenant=' + organisation;
  }

  request(url, function (error, response, body) {
    if (error) return callback(error);
    if (response.statusCode != 200) return callback('Statuscode: ' + response.statusCode);

    console.log(obj);
    var obj = parseStats(JSON.parse(body));
    callback(SUCCESS, obj);
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

// Return router
module.exports = router;
