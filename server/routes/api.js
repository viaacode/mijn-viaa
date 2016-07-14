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


  //region stats
  function stats (req, res, next) {
    // todo: get organisationId from SAML
    var organisationId = 'VRT';
    fetchStats(organisationId, function (err, data) {
      if (err) return next(err);
      res.json(data);
    });
  }

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


    fetchReport(y, type, function (error, data) {
      if (error) return next(error);
      res.json(data);
    });
  }

  function fetchReport (y, type, callback) {
    var options = reportTypeToOptions(y, type);

    var dummyY = DUMMY.reports[y];

    if (!dummyY) {
      return callback("Report '" + y + "' does not exist");
    }

    var typeExists = dummyY[type];

    if (!typeExists) {
      return callback("Report '" + y + "/" + type + "' does not exist");
    }

    var data = DUMMY.reportsGeneration(options);

    result = options;
    result.data = data;

    callback(NO_ERROR, result);
  }

  function reportTypeToOptions (y, type) {
    var DATE_FORMAT = 'YYYY-MM-DD HH:mm:';

    var options = {
      y: y,
      reportType: type,
      begin: '',
      end: '',
      gran: ''
    };

    var beginDate = moment(new Date());
    var granularity = '';

    switch (type) {

      case 'last-week':
        granularity = 'day';
        beginDate = beginDate.startOf(granularity).subtract(1, 'week');
        break;

      case 'last-month':
        granularity = 'day';
        beginDate = beginDate.startOf(granularity).subtract(1, 'month');
        break;

      case 'last-year':
        granularity = 'month';
        beginDate = beginDate.startOf(granularity).subtract(1, 'year');
        break;

      default:
        return {};
    }

    options.begin = beginDate.format(DATE_FORMAT);
    options.gran = granularity;

    return options;
  }

  //endregion

  //region mule test
  function muletest (req, res, next) {
    request(config.muleEndpoint + 'api/stats/global', function (error, response, body) {
      if (error) return next(error);
      if (response.statusCode != 200) return next('Statuscode: ' + response.statusCode);
      res.json(body);
    });
  }

  //endregion
};
