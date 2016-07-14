var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var environments = {
  development: [base, dev],
  dev_auth: [base, dev, authentication]
};

var basedir = path.join(__dirname, '../');

function pathFromBase (p) {
  return path.join(basedir, p);
}

function base () {
  return {
    muleEndpoint: 'http://do-qas-esb-01.do.viaa.be:10005/',
    app: {
      name: 'mijn.VIAA',
      port: process.env.PORT || 1337,
      sessionSecret: process.env.SAML_PATH || 'mijnVIAAetc'
    },
    path: pathFromBase
  };
}

function dev () {
  return {
    apiDelay: {
      min: 1,
      max: 3
    },
    showErrors: true
  };
}

function authentication () {
  return {
    passport: {
      strategy: 'saml',
      saml: {
        // URL that goes from the Identity Provider -> Service Provider
        path: process.env.SAML_PATH || '/login/callback',

        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: process.env.SAML_ENTRY_POINT || 'https://idp-qas.viaa.be/module.php/core/authenticate.php?as=viaa-ldap',

        // Usually specified as `/shibboleth` from site root
        issuer: process.env.ISSUER || 'passport-saml',

        identifierFormat: null,

        // Service Provider private key
        decryptionPvk: fs.readFileSync(pathFromBase('/cert/key.pem'), 'utf8'),

        // Service Provider Certificate
        privateCert: fs.readFileSync(pathFromBase('/cert/key.pem'), 'utf8'),

        // Identity Provider's public key
        cert: process.env.SAML_CERT || fs.readFileSync(pathFromBase('/cert/idp_cert.pem'), 'utf8'),

        validateInResponseTo: false,
        disableRequestedAuthnContext: true
      }
    }
  };
}

module.exports = function (environmentName) {
  var environmentSettings = environments[environmentName];
  if (!environmentSettings) {
    console.log("Error: environment: '" + environmentName + "' is unknown");
    process.exit(1);
  }

  var environment = {};

  _.each(environmentSettings, function (envGenerator) {
    _.extend(environment, envGenerator());
  });

  return environment;
};
