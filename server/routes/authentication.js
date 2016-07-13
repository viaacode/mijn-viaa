module.exports = function (app, config, passport) {

  function auth (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      return res.redirect('/login');
  }

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

};
