var express = require('express');
var supertest = require('supertest');

var apiRoutes = require('../routes/api');

var FAKE_REQUEST = {
  success: function createRequestMockWhichReturns (body) {
    return function requestMock (url, callback) {
      callback(null, {statusCode: 200}, body);
    }
  }
};


describe('routs/api', function () {
  var app;

  beforeEach(function () {
    app = express();
  });

  it('/mule-test should pass json from request without changing it', function (done) {
    var config = {};
    var request = FAKE_REQUEST.success({foo: "bar"});

    apiRoutes(app, config, request);

    supertest(app)
      .get('/api/mule-test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, '{"foo":"bar"}', done);
  });

  it('/stats should format requested data', function (done) {
    var config = {};
    var input = '{"request":{"url":"http://labs.viaa.be/api/v1/archived?tenant=VRT","timestamp":"2016-07-15 00:02:27 +0200","tenant":"VRT","version":"v1","status":"archived"},"response":{"data":{"archived":{"all":8073,"bytes":71661141382754.0,"gigabytes":"66739.64","terabytes":"65.18","petabytes":"0.06"}}}}';
    var expected = '{"terabytes":"65.18","items":8073,"archive_growth":111.12,"registration_growth":111.5}';
    var request = FAKE_REQUEST.success(input);

    apiRoutes(app, config, request);

    supertest(app)
      .get('/api/stats')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expected, done);
  });
});
