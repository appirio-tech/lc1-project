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

var accounts = require('../controllers/accounts');
var tags = require('../controllers/tags');

/**
 * Storage provider
 * @type {Object}
 */
var provider;

// The Package is past automatically as first parameter
module.exports = function(Challenges, app, auth, database, config) {

  /**
   * Application base path
   * @type {String}
   */
  var BASE_PATH = '/challenges';
  /**
  * Initializing storage provider
  */
  var storageProviders = config.storageProviders,
    providerName = config.uploads.storageProvider;

  if(storageProviders.hasOwnProperty(providerName)) {
    var providerConfig = storageProviders[providerName];
    provider = require(config.root + '/' + providerConfig.path)(providerConfig.options, config);
  } else {
    throw new Error(providerName + 'is not configured in Storage Providers');
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
    .all(provider.store)
    .post(files.uploadHandler, routeHelper.renderJson);


    // routes for Challenge model CRUD operations
    app.route('/challenges')
        .get(challenges.all, routeHelper.renderJson)
        .post(auth.requiresLogin, challenges.create, routeHelper.renderJson);
    app.route('/challengesx')
        .get(challenges.allExpanded, routeHelper.renderJson);
    app.route('/challenges/:challengeId')
        .get(challenges.show, routeHelper.renderJson)
        .put(auth.requiresLogin, challenges.update, routeHelper.renderJson)
        .delete(auth.requiresLogin, challenges.destroy, routeHelper.renderJson);
    //expanded chalenge details
    app.route('/challengesx/:challengeId')
          .get(challenges.showx, routeHelper.renderJson);
    app.route('/challenges/:challengeId/launch')
        .post(auth.requiresLogin, launch.launch, routeHelper.renderJson);
    // set the challengeId param
    app.param('challengeId', challenges.challenge);
    app.param('challengeId', challenges.challengeExpanded);


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

    // adding routes for account query and create
    app.route('/accounts')
        .post(auth.requiresLogin, accounts.create, routeHelper.renderJson);
    app.route('/accounts/:queryKey')
        .get(accounts.all, routeHelper.renderJson);

    // adding routes for tag query and create
    app.route('/tags')
        .post(auth.requiresLogin, tags.create, routeHelper.renderJson)
        .get(tags.all, routeHelper.renderJson);

    app.route('/discussionUrl')
        .get(challenges.getDiscussionUrl, routeHelper.renderJson);
        
};
