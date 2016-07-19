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
        {title: 'Dashboard', href: 'dashboard.html', class: view == 'dashboard' ? 'active' : ''},
        {title: 'Diensten', href: 'services.html', class: view == 'services' || view == 'detail' ? 'active' : ''},
        {title: '', href: 'dashboard.html', image: true},
        {title: 'Over', href: '#'},
        {title: 'Account', href: '#'}
      ]
    };

    res.render('base', input);
  }
}

module.exports = function (app) {

  var dashboard = createPage('dashboard', 'Reports - Mijn VIAA', [
    'dist/vue.js',
    'dist/moment.js',
    'dist/chart.js',
    'js/service-available.js',
    'js/app.js',
    'js/dashboard.js',
    'js/selectbox.js'
  ]);
  var services = createPage('services', 'Diensten - Mijn VIAA', [
    'dist/vue.js',
    'js/service-available.js',
    'js/app.js',
    'js/services-overview.js'
  ]);
  var detail = createPage('detail', 'Mijn VIAA', [
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
