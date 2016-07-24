var moment = require('moment');

var jsend = require('../util/jsend');

module.exports = function (router, config, request) {
  router.get('/api/stats/', stats);
  router.get('/api/reports/:y/:type', reports);

  function forwardRequestCall (url, res, next) {
    request(url, function (error, response, body) {
      if (error) return next(error);
      if (response.statusCode != 200) return next(jsend.error(response.statusCode, error));

      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      res
        .append('Content-Type', 'application/json')
        .send(jsend.success(body));
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
      url = config.endpoints.reports[y][type] + '&org=' + organisation;
    } catch (e) {
      return next(jsend.error(404));
    }

    forwardRequestCall(url, res, next);
  }

  //endregion
};
