var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var muleEndpoint = 'http://do-qas-esb-01.do.viaa.be:10005/api/';

// not used but example of all available properties
var template = {
  // Mule endpoint
  endpoints: null,
  // used to map SAML data to available services
  services: null,
  // general app settings
  app: null,
  // contains functions used to get the path to a file or folder
  paths: null,
  // toggle to show api links on /api/docs
  showApiDocs: false,
  // replace all outgoing calls to Mule by dummy data
  dummyRequest: false,
  // fake that these services are available when not logged in
  fakeServicesAvailable: null,
  // api delay for testing graph loading
  apiDelay: null,
  // show extended error messages in api call responses
  showErrors: false,
  // settings for authentication
  passport: null
};

var environments = {
  qas: [base, qas, authentication],
  development: [base, dev],
  dev_auth: [base, dev, authentication]
};

var basedir = path.join(__dirname, '../../');

function pathFromServer (p) {
  return path.join(basedir, 'server/', p || '.');
}

function pathFromApp (p) {
  return path.join(basedir, 'app/', p || '.');
}

function base () {
  return {
    // Mule endpoint
    endpoints: {
      stats: muleEndpoint + 'stats/global',
      muletest: muleEndpoint + 'stats/global',
      reports: {
        items: {
          "last-day": muleEndpoint + 'report/mam/items?gran=last-day',
          "last-week": muleEndpoint + 'report/mam/items?gran=last-week',
          "last-month": muleEndpoint + 'report/mam/items?gran=last-month',
          "last-year": muleEndpoint + 'report/mam/items?gran=last-year',
        },
        terrabytes: {
          "last-day": muleEndpoint + 'report/mam/terrabytes?gran=last-day',
          "last-week": muleEndpoint + 'report/mam/terrabytes?gran=last-week',
          "last-month": muleEndpoint + 'report/mam/terrabytes?gran=last-month',
          "last-year": muleEndpoint + 'report/mam/terrabytes?gran=last-year',
        }
      }
    },
    // used to map SAML data to available services
    services: {
      map: {
        'mediahaven': 'MAM',
        'amsweb': 'AMS',
        'FTP': 'FTP',
        'skryvweb': 'DBS'
      },
      // These services are always available (if logged in)
      always: {
        'FTP': 1
      }
    },
    app: {
      // used in console to tell which app is started
      name: 'mijn.VIAA',
      port: process.env.PORT || 1337,
      sessionSecret: process.env.SESSION_SECRET || 'mijnVIAAetc'
    },
    // used to get the path to a file or folder
    paths: {
      server: pathFromServer,
      app: pathFromApp
    }
  };
}

function dev () {
  return {
    // toggle to show api links on /api/docs
    showApiDocs: true,
    // replace all outgoing calls (eg. to Mule) by dummy data
    dummyRequest: true,
    // fake that these services are available when not logged in
    fakeServicesAvailable: {"MAM": 1, "AMS": 1, "FTP": 1},
    // enable api delay for testing graph loading
    apiDelay: {
      min: 0,
      max: 1
    },
    // show extended error messages in api calls
    showErrors: true
  };
}

function qas () {
  return {
    app: {
      // used in console to tell which app is started
      name: 'mijn.VIAA',
      port: process.env.PORT || 3000,
      sessionSecret: process.env.SESSION_SECRET || 'mijnVIAAetc'
    },
    // show extended error messages in api calls
    showErrors: true
  };
}

function authentication () {
  return {
    // disable api delay for testing graph loading
    apiDelay: null,
    // settings for authentication
    passport: {
      strategy: 'saml',
      saml: {
        // URL that goes from the Identity Provider -> Service Provider
        callbackUrl: process.env.SAML_PATH || 'mijn-qas.viaa.be/login/callback',

        // URL that goes from the Service Provider -> Identity Provider
        entryPoint: process.env.SAML_ENTRY_POINT || 'https://idp-qas.viaa.be/saml2/idp/SSOService.php',

        // Usually specified as `/shibboleth` from site root
        issuer: process.env.ISSUER || 'passport-saml',

        identifierFormat: null,

        // Service Provider private key
        // decryptionPvk: fs.readFileSync(pathFromServer('/cert/key.pem'), 'utf8'),

        // Service Provider Certificate
        // privateCert: fs.readFileSync(pathFromServer('/cert/cert.pem'), 'utf8'),

        // Identity Provider's public key
        cert: process.env.SAML_CERT || fs.readFileSync(pathFromServer('/cert/idp_cert.pem'), 'utf8'),

        validateInResponseTo: false,
        disableRequestedAuthnContext: true
      }
    }
  };
}

/**
 * builds up config from 'environments' field,
 * environments need to be functions with delayed execution
 * authentication requires server/cert/... files to be present
 * to prevent crashes
 */
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
