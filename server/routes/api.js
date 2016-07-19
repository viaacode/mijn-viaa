var moment = require('moment');

module.exports = function (router, config, request) {
  var DUMMY = require('../dummy/dummy');

  /**
   * used in callback argument to return if successful
   * otherwise the error object/message is returned (not a falsy value)
   */
  var NO_ERROR = '';

  router.get('/api/stats/', stats);
  router.get('/api/services/:serviceId', services);
  router.get('/api/reports/:y/:type', reports);
  router.get('/api/mule-test', muletest);

  function forwardRequestCall (url, res, next) {
    request(url, function (error, response, body) {
      if (error) return next(error);
      if (response.statusCode != 200) return next('Statuscode: ' + response.statusCode);
      res
        .append('Content-Type', 'application/json')
        .send(body);
    });
  }

  function getOrganisation (req) {
    var user = req.user || {o: null};
    return user.o;
  }

  //region stats
  function stats (req, res, next) {
    var organisation = getOrganisation(req);

    var url = config.endpoints.stats + '?tenant=' + organisation;

    forwardRequestCall(url, res, next);
  }

  //endregion

  //region services
  function services (req, res, next) {
    var serviceId = req.params.serviceId;
    fetchService(serviceId, function (error, data) {
      if (error) return next(error);
      res.json(data);
    });
  }

  function fetchService (serviceId, callback) {
    // todo fetch service instead of dummy data
    var service = DUMMY.services[serviceId];

    if (!service) {
      return callback("Service '" + serviceId + "' does not exist");
    }

    callback(NO_ERROR, service);
  }

  //endregion

  //region reports
  function reports (req, res, next) {
    /**
     * eg. items, terrabytes
     */
    var y = req.params.y;
    /**
     * eg. last-month
     */
    var type = req.params.type;

    var organisation = getOrganisation(req);

    var url;

    try {
      url = config.endpoints.reports[y][type] + '?org=' + organisation;
    } catch (e) {
      return next(config.error.e404);
    }

    forwardRequestCall(url, res, next);
  }

  //endregion

  //region mule test
  function muletest (req, res, next) {
    var url = config.endpoints.muletest;
    forwardRequestCall(url, res, next);
  }

  //endregion
};
