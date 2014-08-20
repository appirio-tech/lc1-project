/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var db = require('../models');
var _ = require('lodash');

//@todo Move this to somewhere better
db.sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err);
    } else {
      console.log('Connection has been established successfully.');
    }
  });

// Create table if it doesn't already exist
db.sequelize
  .sync()
  .complete(function(err) {
    if (!!err) {
      console.log('An error occurred while creating the table:', err);
    } else {
      console.log('It worked!');
    }
  });


/**
 * Find a challenge by id
 */
exports.challenge = function (req, res, next, id) {
  db.Challenge.find(id).success(function (challenge) {
    if (!challenge) return res.status(400).json({
      error: 'Cannot find the challenge with ' + id
    });

    req.challenge = challenge;
    next();
  })
    .error(function (err) {
      return res.status(400).json({
        error: 'Cannot find the challenge with ' + id
      });
    });
};

/**
 * List of challenges
 */
exports.all = function (req, res) {
  db.Challenge.findAll().success(function (challenges) {
    res.json(challenges);
  })
    .error(function (err) {
      console.log('list err: ' + JSON.stringify(err));
      return res.status(500).json({
        error: 'Cannot list the challenges'
      });
    });
};

/**
 * Create a challenge
 */
exports.create = function (req, res) {
  var data = req.body;
  db.Challenge.create(data).success(function (challenge) {
    res.json(challenge);
  })
    .error(function (err) {
      return res.status(500).json({
        error: 'Cannot create the challenge'
      });
    });
};

/**
 * Update a challenge
 */
exports.update = function (req, res) {
  var challenge = req.challenge;
  challenge = _.extend(challenge, req.body);

  challenge.save().success(function () {
    res.json(challenge);
  })
    .error(function (err) {
      console.log('update err: ' + JSON.stringify(err));
      return res.status(500).json({
        error: 'Cannot update the challenge id ' + challenge.id
      });
    });
};

/**
 * Delete a challenge
 */
exports.destroy = function (req, res) {
  var challenge = req.challenge;
  challenge.destroy().success(function () {
    res.json(challenge);
  })
    .error(function (err) {
      console.log('destroy err: ' + JSON.stringify(err));
      return res.status(500).json({
        error: 'Cannot destroy the challenge id ' + challenge.id
      });
    });
};

/**
 * Show a challenge
 */
exports.show = function (req, res) {
  res.json(req.challenge);
};

