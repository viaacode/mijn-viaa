var express = require('express');
var request = require('supertest');

var apiRoutes = require('../routes/api');

var FAKE_REQUEST = {
  success: function request (url, callback) {
    callback(null, {statusCode: 200}, {foo: "bar"});
  }
};


describe('routs/api', function () {
  var app;

  beforeEach(function() {
    app = express();
  });

  it('/mule-test should pass json from request without changing it', function (done) {
    var config = {};

    apiRoutes(app, config, FAKE_REQUEST.success);

    request(app)
      .get('/api/mule-test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, '{"foo":"bar"}', done);
  });
});
