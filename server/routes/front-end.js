var ejs = require("ejs");

function createPage (view, title, scripts) {
  return function dashboard (req, res, next) {
    res.render('base', {
      title: title,
      body: {
        view: view,
        scripts: scripts,
        body: {}
      }
    });
  }
}

module.exports = function (app) {

  var dashboard = createPage('dashboard', 'Reports - Mijn VIAA', [
    'dist/vue.js',
    'dist/moment.js',
    'dist/chart.js',
    'js/service-available.js',
    'js/app.js',
    'js/dashboard.js'
  ]);
  var services = createPage('services', 'Diensten - Mijn VIAA', [
    'dist/vue.js',
    'js/service-available.js',
    'js/app.js',
    'js/services-overview.js'
  ]);
  var detail = createPage('services', 'Mijn VIAA', [
    'dist/vue.js',
    'js/service-available.js',
    'js/app.js',
    'js/services-detail.js'
  ]);


  app.get('/', dashboard);
  app.get('/pages/dashboard.html', dashboard);
  app.get('/pages/services.html', services);
  app.get('/pages/detail.html', detail);
};
