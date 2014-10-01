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

var http = require('http');

/**
 * Find a challenge by id
 */
exports.challenge = function(req, res, next, id) {
  Challenge.find(id).success(function(challenge) {
    if (!challenge) {
      routeHelper.addErrorMessage(req, 'EntityNotFound', 'Cannot find the challenge with id ' + id, 404);
    } else {
      req.challenge = challenge;
    }
    next();
  })
    .error(function(err) {
      routeHelper.addError(req, 'DatabaseReadError', err);
      next();
    });
};

/**
 * Find a challenge by id with files and account expanded
 */
exports.challengeExpanded = function(req, res, next, id) {
  console.log('the id you are looking for is: ', id);
  Challenge.find({
    where: {
      id: id
    },
    include: [File, Account]
  }).success(function(challenge) {
    if (!challenge) {
      routeHelper.addErrorMessage(req, 'EntityNotFound', 'Cannot find the challenge with id ' + id, 404);
    } else {
      req.challengeExpanded = challenge;
      console.log('the id you are looking for is: ', id);
    }
    next();
  })
    .error(function(err) {
      routeHelper.addError(req, 'DatabaseReadError', err);
      next();
    });
};

/**
 * List of challenges
 */
exports.all = function(req, res) {
  Challenge.findAndCountAll({
    where: ['1=1'],
    limit: req.query.take || 10,
    offset: req.query.skip || 0
  }).success(function(result) {
    res.json({
      totalCount: result.count,
      data: result.rows
    });
  })


  .error(function(err) {
    console.log('list err: ' + JSON.stringify(err));
    return res.status(500).json({
      error: 'Cannot list the challenges'
    });
  });
};



/**
 * List of challenges on heroku
 */
exports.allOnHeroku = function (options, res, error) {
    var req;
        options = {
        host: 'serenity-core1.herokuapp.com',
        path: '/challenges',
        data: '',
        method: 'get',
        headers: {'User-Agent': 'kbowerma'}
    };
    var data = options.data;
    var method = options.method.toLowerCase();
    delete options.data;
    // host and path is manatory
    if (!options.host || !options.path) {
        console.log(' [Error in API request] both host and path are required');
        return;
    }
    // if the data is object, covert it to a json string.
    if (typeof data === 'object') data = JSON.stringify(data);
    // set Content-Length and Content-Type in case of post request.
    if (method !== 'get') {
        var headers = options.headers;
        headers['Content-Length'] = data.length;
        if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }
    // sends http request
    req = http.request(options, function (response) {
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            var data = null;
            // console.log(" => Response : ", body);
            if (body) {
                try {
                    data = JSON.parse(body);
                }
                catch (err) {
                    data = body;
                }
            }
            if (res) res.json(data);
        });
    });
    req.on('error', function (err) {
        console.log(' => Error while API request : ', err);
        if (error) error(err);
    });
    // if there is data to send
    if (method !== 'get' && data.length > 0) {
        req.write(data);
    }
    req.end();
};



/**
 * List of challenges Expanded to get the Files and Accounts
 */
exports.allExpanded = function(req, res) {
  Challenge.findAndCountAll({
    where: ['1=1'],
    include: [File, Account],
    limit: req.query.take || 10,
    offset: req.query.skip || 0
  }).success(function(result) {
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
  .error(function(err) {
    console.log('list err: ' + JSON.stringify(err));
    return res.status(500).json({
      error: 'Cannot list the expanded challenges'
    });
  });
};

/**
 * Create a challenge
 */
exports.create = function(req, res, next) {
  var data = req.body;
  Challenge.create(data).success(function(challenge) {
    req.data = challenge;
    next();
  })
    .error(function(err) {
      routeHelper.addError(req, 'DatabaseSaveError', err);
      next();
    });
};

/**
 * Create a challenge on Heroku
 */
exports.createHeroku = function(req, res, next) {

var options = {
  hostname: 'serenity-core1.herokuapp.com',
  port: 80,
  path: '/challenges',
  method: 'POST'
};

var reqx = http.request(options, function(res) {
  console.log('STATUS: ' + res.statusCode);
  console.log('HEADERS: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (chunk) {
    console.log('BODY: ' + chunk);
  });
});

reqx.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});

// write data to request body
reqx.write('data\n');
reqx.write('data\n');
reqx.end();







};

/**
 * Update a challenge
 */
exports.update = function(req, res, next) {
  if (req.error) return next();

  var challenge = req.challenge;
  challenge = _.extend(challenge, req.body);
  challenge.save().success(function() {
    req.data = challenge;
    next();
  })
    .error(function(err) {
      console.log('update err: ' + JSON.stringify(err));

      var status_code = 500;
      if (challenge.title.length === 0)
        status_code = 403;

      routeHelper.addError(req, 'DatabaseSaveError', err, status_code);
      next();
    });
};

/**
 * Delete a challenge
 */
exports.destroy = function(req, res, next) {
  if (req.error) return next();

  var challenge = req.challenge;
  challenge.destroy().success(function() {
    req.data = challenge;
    next();
  })
    .error(function(err) {
      console.log('destroy err: ' + JSON.stringify(err));
      routeHelper.addError(req, 'DatabaseSaveError', err);
      next();
    });
};

/**
 * Show a challenge
 */
exports.show = function(req, res, next) {
  if (req.error) return next();
  console.log('show called');

  req.data = req.challenge;
  next();
};

/**
 * Show a expanded challenge
 */
exports.showx = function(req, res, next) {
  if (req.error) return next();
  console.log('showx called');

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
    if (challenge) {
      challenge.getFiles().success(function(files) {
        req.data = files;
        return next();
      }).error(function(err) {
        routeHelper.addError(req, 'DatabaseReadError', err);
        return next();
      });
    } else {
      // No files for the given challenge id
      // Instead of throwing error will return HTTP NO CONTENT
      return next();
    }
  }).error(function(err) {
    routeHelper.addError(req, 'DatabaseReadError', err);
    return next();
  });
};
