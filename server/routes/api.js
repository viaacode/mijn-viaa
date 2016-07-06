var express = require('express');
var request = require('request');
var router = express.Router();

// used in callback argument to return if successful
// otherwise the error object/message is returned (not a falsy value)
var SUCCESS = '';
var NO_ORGANISATION = '';

//region Dummy data
var dummy = {
  global: {
    terabytes: 42,
    items: 2471,
    archive_growth: 446.12,
    registration_growth: 443.5
  },
  organisations: createDummyOrganisationsStats()
};

function createDummyOrganisationsStats () {
  var companies = [];
  companies["VRT"] = {
    terabytes: 33,
    items: 234,
    archive_growth: 3333.12,
    registration_growth: 867.5
  };
  companies["plantentuin"] = {
    terabytes: 11,
    items: 64564,
    archive_growth: 456.12,
    registration_growth: 23.5
  };
  return companies;
}
//endregion

function fetchStats (organisation, callback) {

  var url = 'http://labs.viaa.be/api/v1/archived';

  if (organisation !== NO_ORGANISATION) {
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

router.get('/stats/', function (req, res, next) {
  fetchStats(NO_ORGANISATION, function (err, data) {
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

// Return router
module.exports = router;
