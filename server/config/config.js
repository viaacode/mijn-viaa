module.exports = {
  development: {
    app: {
      name: 'mijn.VIAA',
      port: process.env.PORT || 1337,
      sessionSecret: process.env.SAML_PATH || 'mijnVIAAetc'
    },
    passport: {
      strategy: 'saml',
      saml: {
        path: process.env.SAML_PATH || '/login/callback',
        entryPoint: process.env.SAML_ENTRY_POINT || 'https://idp-qas.viaa.be/module.php/core/frontpage_welcome.php',
        issuer: 'passport-saml',
        cert: process.env.SAML_CERT || null
      }
    }
  }
};
