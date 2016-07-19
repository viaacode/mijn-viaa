var ejs = require("ejs");

function createPage (view, title, scripts) {
  return function dashboard (req, res, next) {
    var input = {
      title: title,
      body: {
        view: view,
        scripts: scripts,
        body: {}
      },
      navigation: [
        {title: 'Dashboard', href: 'dashboard', class: view == 'dashboard' ? 'active' : ''},
        {title: 'Diensten', href: 'services', class: view == 'services' || view == 'detail' ? 'active' : ''},
        {title: '', href: 'dashboard', image: true},
        {title: 'Over', href: '#'},
        {title: 'Account', href: '#'}
      ]
    };

    res.render('base', input);
  }
}

module.exports = function (app) {

  var dashboard = createPage('dashboard', 'Reports - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/moment.js',
    'public/js/chart.js',
    'public/js/service-available.js',
    'public/js/app.js',
    'public/js/dashboard-config.js',
    'public/js/dashboard.js',
    'public/js/dashboard-selectbox.js'
  ]);
  var services = createPage('services', 'Diensten - Mijn VIAA', [
    'public/js/vue.js',
    'public/js/service-available.js',
    'public/js/app.js',
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


  app.get('/', dashboard);
  app.get('/dashboard', dashboard);
  app.get('/services', services);
  app.get('/detail', detail);
};
