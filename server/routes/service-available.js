module.exports = function (app, config) {
  app.get('/pages/js/service-available.js', getAvailableServices);

  function getAvailableServices (req, res, next) {
    var services;
    if (req.user) {
      services = parseServices(req.user.apps);
    } else {
      services = config.fakeServicesAvailable || {};
    }
    console.log(services);

    var isServiceAvailableFunction = 'function isServiceAvailable(serviceName){return ' +
      JSON.stringify(services) +
      '[serviceName];}';

    res.send(isServiceAvailableFunction);
  }

  function parseServices (input) {
    var services = {};

    for (var key in input) {
      var value = input[key];
      var mapped = config.servicesMap[value];

      if (!mapped) {
        console.log("WARNING: service-available.js service '" + value + "' is unknown, skipping");
        continue;
      }

      services[mapped] = 1;
    }

    return services;
  }
};