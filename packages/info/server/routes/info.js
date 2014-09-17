'use strict';

//Datapoints routes use data points controller
var datapoints = require('../controllers/issues');

// The Package is past automatically as first parameter
module.exports = function(Info, app, auth, database) {
/*
  app.get('/info/example/anyone', function(req, res, next) {
    res.send('Anyone can access this');
  });

  app.get('/info/example/auth', auth.requiresLogin, function(req, res, next) {
    res.send('Only authenticated users can access this');
  });

  app.get('/info/example/admin', auth.requiresAdmin, function(req, res, next) {
    res.send('Only users with Admin role can access this');
  });

  app.get('/info/example/render', function(req, res, next) {
    Info.render('index', {
      package: 'info'
    }, function(err, html) {
      //Rendering a view from the Package server/views
      res.send(html);
    });
  });
*/

   app.route('/issues')
        .get(auth.requiresLogin, datapoints.issues);


};
