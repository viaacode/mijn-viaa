var express = require('express');
var router = express.Router();


//region Dummy data
var dummy = {
  global: {
    tb: 42,
    items: 2471,
    archive_growth: 446.12,
    registration_growth: 443.5
  },
  organisations: createDummyOrganisationsStats()
};

function createDummyOrganisationsStats () {
  var companies = new Array();
  companies["vrt"] = {
    tb: 33,
    items: 234,
    archive_growth: 3333.12,
    registration_growth: 867.5
  };
  companies["plantentuin"] = {
    tb: 11,
    items: 64564,
    archive_growth: 456.12,
    registration_growth: 23.5
  };
  return companies;
}
//endregion

router.get('/stats/', function (req, res, next) {
  res.json(dummy.global);

});

// todo: auth
router.get('/stats/organisation/:organisationId', function (req, res, next) {
  var organisationId = req.params.organisationId;
  var organisation = dummy.organisations[organisationId];

  if (!organisation) return next("Organisation '" + organisationId + "' does not exist");

  res.json(organisation);
});

// Return router
module.exports = router;
