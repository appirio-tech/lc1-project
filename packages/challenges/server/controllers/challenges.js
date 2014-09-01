/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var postgresql = require('postgresql-sequelize');
var sequelize = postgresql.sequelize;
var Challenge = sequelize.model('challenge');
var _ = require('lodash');


/**
 * Find a challenge by id
 */
exports.challenge = function (req, res, next, id) {
  Challenge.find(id).success(function (challenge) {
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
  Challenge.findAll().success(function (challenges) {
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
  Challenge.create(data).success(function (challenge) {
    res.json(challenge);
  })
    .error(function (err) {
      console.log('create err: ' + JSON.stringify(err));
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

  if(challenge.prizes){
    var tmp_prize;
    for(var i=0; i<challenge.prizes.prizesArray.length; i+=1){
      tmp_prize = challenge.prizes.prizesArray[i];
      if(tmp_prize.amount===0) continue;
      //prize amount invalid.
      if(!tmp_prize.amount || tmp_prize.amount<0 || typeof(tmp_prize.amount)!=='number' ){
        return res.status(403).json({
          error: 'Cannot update the challenge id ' + challenge.id
        });
      }
    }
  }
  challenge.prizes = JSON.stringify(challenge.prizes);

  challenge.save().success(function () {
    res.json(challenge);
  })
    .error(function (err) {
      console.log('update err: ' + JSON.stringify(err));

      var status_code = 500;
      if (challenge.title.length === 0)
        status_code = 403;
      else
        status_code = 500;

      return res.status(status_code).json({
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

