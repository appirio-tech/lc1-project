/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Challenges = new Module('challenges');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Challenges.register(function (app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Challenges.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Challenges.menus.add({
    title: 'Challenges',
    link: 'all challenges',
    roles: ['authenticated'],
    menu: 'main'
  });
  Challenges.menus.add({
    title: 'Challenges multiview',
    link: 'all challenges multi',
    roles: ['authenticated'],
    menu: 'main'
  });
  Challenges.menus.add({
    title: 'Create New Challenge',
    link: 'create challenge',
    roles: ['authenticated'],
    menu: 'main'
  });

  /**
   //Uncomment to use. Requires meanio@0.3.7 or above
   // Save settings with callback
   // Use this for saving data from administration pages
   Challenges.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

   // Another save settings example this time with no callback
   // This writes over the last settings.
   Challenges.settings({
        'anotherSettings': 'some value'
    });

   // Get settings. Retrieves latest saved settigns
   Challenges.settings(function(err, settings) {
        //you now have the settings object
    });
   */
  Challenges.aggregateAsset('css', 'challenges.css');

  return Challenges;
});
