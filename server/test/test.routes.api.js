var supertest = require('supertest');

var configEnvironments = require('../config/config');
var appConfig = require('../app');

var FAKE_REQUEST = {
  success: function createRequestMockWhichReturns (body) {
    return function requestMock (url, callback) {
      callback(null, {statusCode: 200}, body);
    }
  }
};


describe('routs/api', function () {
  var app;
  var request;
  var config;

  before(function () {
    config = configEnvironments('development');
    config.apiDelay = null;
  });

  it('/mule-test should pass json from request without changing it', function (done) {
    var input = {foo: "bar"};
    var expected = '{"foo":"bar"}';
    var request = FAKE_REQUEST.success(input);
    app = appConfig(config, request);

    supertest(app)
      .get('/api/mule-test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expected)
      .end(done);
  });

  it('/stats should format requested data', function (done) {
    var input = '{"request":{"url":"http://labs.viaa.be/api/v1/archived?tenant=VRT","timestamp":"2016-07-15 00:02:27 +0200","tenant":"VRT","version":"v1","status":"archived"},"response":{"data":{"archived":{"all":8073,"bytes":71661141382754.0,"gigabytes":"66739.64","terabytes":"65.18","petabytes":"0.06"}}}}';
    var expected = '{"terabytes":"65.18","items":8073,"archive_growth":111.12,"registration_growth":111.5}';
    var request = FAKE_REQUEST.success(input);

    app = appConfig(config, request);

    supertest(app)
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expected, done);
  });
});

describe('authentication', function () {
  var app;
  var config = configEnvironments('dev_auth');

  beforeEach(function () {
    app = appConfig(config, null);
  });

  it('API should return HTTP 401 when not logged in', function (done) {
    supertest(app)
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect(401, done);
  });

  it('Pages should redirect when not logged in', function (done) {

    supertest(app)
      .get('/pages/dashboard.html')
      .expect(303)
      .expect('Location', '/login')
      .end(done);
  });

  it('js files should not redirect redirect when not logged in', function (done) {
    supertest(app)
      .get('/pages/js/app.js')
      .expect(200)
      .end(done);
  });
});

describe('services available', function () {
  var app;
  var config = configEnvironments('dev_auth');

  beforeEach(function () {
    app = appConfig(config, null);
  });

  it('should return be empty when not logged in', function (done) {
    var expected = 'function isServiceAvailable(serviceName){return ' +
      '{}' +
      '[serviceName];}';

    supertest(app)
      .get('/pages/js/service-available.js')
      .expect(200)
      .expect(expected)
      .end(done);
  });

  it('should return req.user.apps when not logged in', function (done) {
    var inputServices = ['mediahaven (mam)', 'amsweb', 'FTP'];
    var expected = 'function isServiceAvailable(serviceName){return ' +
      '{"MAM":1,"AMS":1,"FTP":1}' +
      '[serviceName];}';

    var getAvailableServices;
    var app = {
      get: function (url, f) {
        getAvailableServices = f;
      }
    };

    require('../routes/service-available')(app, config);

    var req = {
      user: {
        apps: inputServices
      }
    };

    var res = {
      send: function (text) {
        if (expected != text) {
          return done('not equal - received: ' + text + ' but expected: ' + expected);
        }
        done();
      }
    };

    getAvailableServices(req, res, function () {
    });
  });
});
