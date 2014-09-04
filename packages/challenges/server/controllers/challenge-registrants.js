/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var postgresql = require('postgresql-sequelize');
var sequelize = postgresql.sequelize;
var ChallengeRegistrant = sequelize.model('ChallengeRegistrant');
var routeHelper = require('../lib/routeHelper');

exports.register = function(req, res, next){
  var chaReg = {
    challengeId: req.challenge.id,
    userId:  req.user._id.toString()
  };
  ChallengeRegistrant.findOrCreate(chaReg).success(function(chaReg, created){
    if(!created)
      routeHelper.addValidationError(req, 'already registered');
    next();
  }).error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};

exports.getRegInfoByCha = function(req, res, next){
  ChallengeRegistrant.findAll({where: {challengeId: req.challenge.id}}).success(function(data){
    req.data = data;
    next();
  })
  .error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};
