var moment = require('moment');

var jsend = require('../util/jsend');

module.exports = function (router, config, request) {
  router.get('/api/stats/', stats);
  router.get('/api/report/:service/:what?', report);

  function forwardRequestCall (url, res, next, parse) {
    console.log('executing forwardRequestCall(' + url + ')');

    request(url, function (error, response, body) {
      if (error) return next(error);
      if (response.statusCode != 200) return next(jsend.error(response.statusCode, error));

      if (typeof body === 'string') {
        body = JSON.parse(body);
      }

      data = parse ? parse(body.data) : body.data;

      res
        .append('Content-Type', 'application/json')
        .send(jsend.success(data));
    });
  }

  function getOrganisation (req) {
    var user = req.user || {o: 'OR-w66976m'};
    return user.o;
  }

  //region stats
  function stats (req, res, next) {
    var organisation = getOrganisation(req);

    var url = config.muleHost + config.endpoints.stats + '?cp=' + organisation;

    forwardRequestCall(url, res, next);
  }

  //endregion

  //region reports
  function report (req, res, next) {
    var service = req.params.service;
    if (service === 'mam') {
      var what = req.params.what || 'items'; // items or bytes
    } else {
      var what = req.params.what || 'total'; // total, audio, video, paper or film
    }
    var gran = req.query.gran || 'last-day';
    if (!service || !what || !gran) return next(jsend.error(404));


    var reportEndpoints = config.endpoints.report;
    if (!reportEndpoints[service]
      || !reportEndpoints[service]
      || !reportEndpoints[service][gran]) return next(jsend.error(404));

    var organisation = getOrganisation(req);

    var url = config.muleHost
      + reportEndpoints[service][gran]
      + '&cp=' + organisation;

    forwardRequestCall(url, res, next, function (object) {
      return {
        service: service,
        what: what,
        granularity: gran,
        data: object
      };
    });
  }

  //endregion
};
