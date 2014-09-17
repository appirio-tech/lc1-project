'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Info = new Module('info');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Info.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Info.routes(app, auth, database);

  //We are adding a link to the main menu for all authenticated users
  Info.menus.add({
    title: 'info',
    link: 'info page',
    roles: ['authenticated'],
    menu: 'main'
  });

  Info.aggregateAsset('css', 'info.css');

  /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Info.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Info.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Info.settings(function(err, settings) {
        //you now have the settings object
    });
    */

  return Info;
});
