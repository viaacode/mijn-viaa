var supertest = require('supertest');
var expect = require('chai').expect;

var configEnvironments = require('../config/config');
var appConfig = require('../app');

var FAKE_REQUEST = {
  success: function createRequestMockWhichReturns (body) {
    return function requestMock (url, callback) {
      callback(null, {statusCode: 200}, body);
    }
  }
};


describe('routes/api', function () {
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

  it('/stats should pass json from request without changing it', function (done) {
    var input = {foo: "bar"};
    var expected = '{"foo":"bar"}';
    var request = FAKE_REQUEST.success(input);
    app = appConfig(config, request);

    supertest(app)
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expected, done);
  });

  it('/reports/items/last-month should pass json from request without changing it', function (done) {
    var input = {foo: "bar"};
    var expected = '{"foo":"bar"}';
    var request = FAKE_REQUEST.success(input);
    app = appConfig(config, request);

    supertest(app)
      .get('/api/reports/items/last-month')
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
      .get('/dashboard')
      .expect(303)
      .expect('Location', '/login')
      .end(done);
  });

  it('js files should not redirect redirect when not logged in', function (done) {
    supertest(app)
      .get('/public/js/app.js')
      .expect(200)
      .end(done);
  });
});

describe('services available', function () {
  var app;
  var config;

  beforeEach(function () {
    config = configEnvironments('dev_auth');
    app = appConfig(config, null);
  });

  it('should return be config.fakeServicesAvailable when not logged in', function (done) {
    config.fakeServicesAvailable = {};

    var expected = 'var mijnVIAA=mijnVIAA||{};mijnVIAA.isServiceAvailable=function(serviceName){return {}[serviceName];};mijnVIAA.getOrganisationName=function(){return "";};';

    supertest(app)
      .get('/public/js/service-available.js')
      .expect(200)
      .expect(expected)
      .end(done);
  });

  it('should return req.user.apps when not logged in', function (done) {
    var inputServices = ['mediahaven', 'amsweb'];
    var expected = 'var mijnVIAA=mijnVIAA||{};mijnVIAA.isServiceAvailable=function(serviceName){return {"MAM":1,"AMS":1,"FTP":1}[serviceName];};mijnVIAA.getOrganisationName=function(){return "";};';

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
        expect(text).to.equal(expected);
        done();
      }
    };

    getAvailableServices(req, res, function () {
    });
  });
});

describe('DUMMY request', function () {
  var DUMMY = require('../dummy/dummy');
  var app;
  var config;

  beforeEach(function () {
    config = configEnvironments('development');
    app = appConfig(config, DUMMY.request);
  });

  it('should generate reports when url from config.endpoints.reports', function (done) {
    supertest(app)
      .get('/api/reports/items/last-month')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function (res) {
        expect(res.body).to.have.property('y').to.equal('items');
        expect(res.body).to.have.property('reportType').to.equal('last-month');
        expect(res.body).to.have.property('data').to.be.an('array');
      })
      .end(done);
  });

  it('should error 404 when reports unknown', function (done) {
    var path = '/api/reports/foo/last-month';

    supertest(app)
      .get(path)
      .expect({
        status: 'error',
        message: '404 Not Found'
      })
      .expect(404)
      .end(done);
  });
});
