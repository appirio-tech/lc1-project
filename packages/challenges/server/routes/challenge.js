/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var challenges = require('../controllers/challenges');
var launch = require('../controllers/launch');
var requirements = require('../controllers/challenge-requirements');
var challengeRegistrants = require('../controllers/challenge-registrants');
var routeHelper = require('../lib/routeHelper');

// The Package is past automatically as first parameter
module.exports = function(Challenges, app, auth, database) {

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
    // route for requirement neccesities
    app.route('/requirementNeccesities')
        .get(requirements.requirementNeccesities, routeHelper.renderJson);

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

};
