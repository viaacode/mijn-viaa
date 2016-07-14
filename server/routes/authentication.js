module.exports = function (app, config, passport) {
  app.post('/login/callback',
    passport.authenticate('saml', {failureRedirect: '/login/fail'}),
    function (req, res, next) {
      res.redirect('/');
    }
  );

  app.get('/login/fail',
    function (req, res) {
      res.status(401).send('Login failed');
    }
  );

  function ensureAuthentication (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      return res.redirect('/login');
  }

  return ensureAuthentication;
};
