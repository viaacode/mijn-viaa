var ejs = require("ejs");

function createPage (view, title, scripts) {
  var input = {
    title: title,
    page: view,
    pageData: null,
    scripts: scripts,
    activePages: {}
  };

  // decide which menu item activate
  var activeView = view;

  // highlight services when view is detail
  if (activeView == 'detail') input.activePages['services'] = 1;
  input.activePages[activeView] = 1;

  return function (req, res, next) {
    res.render('base', input);
  }
}

module.exports = function (app, config, middleware) {

  var dashboard = createPage('dashboard', 'Reports - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/moment.js',
    'public/js/chart.js',
    'public/js/service-available.js',
    'public/js/app.js',
    'public/js/dashboard-config.js',
    'public/js/dashboard.js',
  ]);
  var services = createPage('services', 'Diensten - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/service-available.js',
    'public/js/app.js',
    'public/js/moment.js',
    'public/js/services-config.js',
    'public/js/services-overview.js'
  ]);
  var detail = createPage('detail', 'Mijn VIAA', [
    'public/js/vue.js',
    'public/js/service-available.js',
    'public/js/app.js',
    'public/js/services-config.js',
    'public/js/services-detail.js'
  ]);


  app.get('/', middleware, dashboard);
  app.get('/dashboard', middleware, dashboard);
  app.get('/services', middleware, services);
  app.get('/detail', middleware, detail);
};
