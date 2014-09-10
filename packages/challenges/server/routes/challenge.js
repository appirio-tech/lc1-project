/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var challenges = require('../controllers/challenges');
var launch = require('../controllers/launch');
var requirements = require('../controllers/challenge-requirements');
var challengeRegistrants = require('../controllers/challenge-registrants');
var routeHelper = require('../lib/routeHelper');

/**
 * File controller
 * @type {Object}
 */
var files = require('../controllers/files');

/**
 * File upload middlewares
 * @type {Object}
 */
var LocalUploadMiddleware = require('../middleware/LocalUploadMiddleware');
var S3UploadMiddleware = require('../middleware/S3UploadMiddleware');

// The Package is past automatically as first parameter
module.exports = function(Challenges, app, auth, database, config) {

    /**
     * Application base path
     * @type {String}
     */
    var BASE_PATH = '/challenges';
    /**
    * Initializing file upload middle ware based on configuration
    */
    var uploadOptions = config.uploads;
    var uploadMiddleware;
    if(uploadOptions.isLocalStorage) {
    /**
     * Local storage is configured. Initializing local upload middleware
     */
    uploadMiddleware = new LocalUploadMiddleware(config);
  } else {
    /**
     * Local storage is not configured. Default storage option would be Amazon s3 service
     * Initializing amazon s3 middleware
     */
    uploadMiddleware = new S3UploadMiddleware(config);
  }

  /**
   * configuring middlewares for file upload
   */
  app.route(BASE_PATH + '/:challengeId/upload')
    /**
     * configuring middlewares for express-jwt
     * Added routeHelper middleware
     */
    .all(auth.requiresLogin)
    .all(uploadMiddleware)
    .post(files.uploadHandler, routeHelper.renderJson);


    // routes for Challenge model CRUD operations
    app.route('/challenges')
        .get(challenges.all, routeHelper.renderJson)
        .post(auth.requiresLogin, challenges.create, routeHelper.renderJson);
    app.route('/challenges/:challengeId')
        .get(challenges.show, routeHelper.renderJson)
        .put(auth.requiresLogin, challenges.update, routeHelper.renderJson)
        .delete(auth.requiresLogin, challenges.destroy, routeHelper.renderJson);
    app.route('/challenges/:challengeId/launch')
        .post(auth.requiresLogin, launch.launch, routeHelper.renderJson);
    // set the challengeId param
    app.param('challengeId', challenges.challenge);


    // route for requirement types
    app.route('/requirementTypes')
        .get(requirements.requirementTypes, routeHelper.renderJson);
    // route for requirement necessities
    app.route('/requirementNecessities')
        .get(requirements.requirementNecessities, routeHelper.renderJson);

    // routes for challenge requirements
    app.route('/challenges/:challengeId/requirements')
        .get(requirements.all, routeHelper.renderJson)
        .post(auth.requiresLogin, requirements.create, routeHelper.renderJson);
    app.route('/challenges/:challengeId/requirements/:requirementId')
        .get(requirements.show, routeHelper.renderJson)
        .put(auth.requiresLogin, requirements.update, routeHelper.renderJson)
        .delete(auth.requiresLogin, requirements.destroy, routeHelper.renderJson);
    app.param('requirementId', requirements.challengeRequirement);

    // routes for register challenge
    app.route('/challenges/:challengeId/register')
        .post(auth.requiresLogin, challengeRegistrants.register, routeHelper.renderJson)
        .get(challengeRegistrants.getRegInfoByCha, routeHelper.renderJson);


    // adding route to get all files for a challenge
    // Added route Helper middle ware
    app.route(BASE_PATH + '/:challengeId/files')
        .all(auth.requiresLogin)
        .get(challenges.getAllFiles, routeHelper.renderJson);

    // adding routes for file delete
    // Added route Helper middle ware
    app.route(BASE_PATH + '/files/:fileId')
        .all(auth.requiresLogin)
        .delete(files.deleteFile, routeHelper.renderJson);

};
