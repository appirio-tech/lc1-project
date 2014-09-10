/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var _ = require('lodash');
var routeHelper = require('../lib/routeHelper');

/**
 * HTTP OK STATUS CODE
 */
var HTTP_OK = 200;

/**
 * HTTP SERVER ERROR STATUS CODE
 */
var HTTP_SERVER_ERROR = 500;

/**
 * HTTP NO CONTENT STATUS CODE
 */
var HTTP_NO_CONTENT = 204;

/**
 * Find a challenge by id
 */
exports.challenge = function (req, res, next, id) {
  Challenge.find(id).success(function (challenge) {
    if (!challenge) {
      routeHelper.addErrorMessage(req, 'EntityNotFound', 'Cannot find the challenge with id '+id, 404);
    } else {
      req.challenge = challenge;
    }
    next();
  })
    .error(function (err) {
      routeHelper.addError(req, 'DatabaseReadError', err);
      next();
    });
};

/**
 * List of challenges
 */
exports.all = function (req, res, next) {
  Challenge.findAll().success(function (challenges) {
    req.data = challenges;
    next();
  })
    .error(function (err) {
        routeHelper.addError(req, 'DatabaseReadError', err);
        next();
    });
};

/**
 * Create a challenge
 */
exports.create = function (req, res, next) {
  var data = req.body;
  Challenge.create(data).success(function (challenge) {
    req.data = challenge;
    next();
  })
    .error(function (err) {
      routeHelper.addError(req, 'DatabaseSaveError', err);
      next();
    });
};

/**
 * Update a challenge
 */
exports.update = function (req, res, next) {
  if (req.error) return next();

  var challenge = req.challenge;
  challenge = _.extend(challenge, req.body);
  challenge.save().success(function () {
    req.data = challenge;
    next();
  })
    .error(function (err) {
      console.log('update err: ' + JSON.stringify(err));

      var status_code = 500;
      if(challenge.title.length === 0)
        status_code = 403;
      
      routeHelper.addError(req, 'DatabaseSaveError', err, status_code);
      next();
    });
};

/**
 * Delete a challenge
 */
exports.destroy = function (req, res, next) {
  if (req.error) return next();

  var challenge = req.challenge;
  challenge.destroy().success(function () {
    req.data = challenge;
    next();
  })
    .error(function (err) {
      console.log('destroy err: ' + JSON.stringify(err));
      routeHelper.addError(req, 'DatabaseSaveError', err);
      next();
    });
};

/**
 * Show a challenge
 */
exports.show = function (req, res, next) {
  if (req.error) return next();

  req.data = req.challenge;
  next();
};


/**
 * Reurns the list of files for the specified challege Id
 * @param  {Object}         req         Request Object
 * @param  {Object}         res         Response object
 * @param  {Function}       next        Next function
 */
exports.getAllFiles = function(req, res, next) {
  var challengeId = req.params.challengeId;

  Challenge.find(challengeId).success(function(challenge) {
    if(challenge) {
      challenge.getFiles().success(function(files) {
        req.data = files;
        return next();
      }).error(function(err) {
        routeHelper.addError(req, 'DatabaseReadError',err);
        return next();
      });
    } else {
      // No files for the given challenge id
      // Instead of throwing error will return HTTP NO CONTENT
      return next();
    }
  }).error(function(err) {
      routeHelper.addError(req, 'DatabaseReadError',err);
      return next();
  });
};
