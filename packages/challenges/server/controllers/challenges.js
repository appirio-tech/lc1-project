/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var File = datasource.File;
var Account = datasource.Account;
var _ = require('lodash');
var routeHelper = require('../lib/routeHelper');

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
 * Find a challenge by id with files and account expanded
 */
exports.challengeExpanded = function (req, res, next, id) {
  Challenge.find({where: {id: id}, include: [File,Account]}).success(function (challenge) {
    if (!challenge) {
      routeHelper.addErrorMessage(req, 'EntityNotFound', 'Cannot find the challenge with id '+id, 404);
    } else {
      req.challengeExpanded = challenge;
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
exports.all = function (req, res) {
  Challenge.findAndCountAll({
    where: ['1=1'],
    limit: req.query.take || 10,
    offset: req.query.skip || 0
  }).success(function (result) {
    res.json({
      totalCount: result.count,
      data: result.rows
    });
  })

  /*Challenge.findAll().success(function (challenges) {
  res.json({
      totalCount: 100,
      data: challenges
  });
})*/
  .error(function (err) {
    console.log('list err: ' + JSON.stringify(err));
    return res.status(500).json({
      error: 'Cannot list the challenges'
    });
  });
};



/**
 * List of challenges Expanded to get the Files and Accounts
 */
exports.allExpanded = function (req, res) {
  Challenge.findAndCountAll({
    where: ['1=1'],
    include:  [File,Account],
    limit: req.query.take || 10,
    offset: req.query.skip || 0
  }).success(function (result) {
    console.log(' the files are' + result.file);
    res.json({
      totalCount: result.count,
      data: result.rows
    });
  })

    /*Challenge.findAll().success(function (challenges) {
    res.json({
        totalCount: 100,
        data: challenges
    });
  })*/
    .error(function (err) {
      console.log('list err: ' + JSON.stringify(err));
      return res.status(500).json({
        error: 'Cannot list the expanded challenges'
      });
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
 * Show a expanded challenge
 */
exports.showx = function (req, res, next) {
  if (req.error) return next();

  req.data = req.challengeExpanded;
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
