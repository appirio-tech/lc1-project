/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var ChallengeRegistrant = datasource.ChallengeRegistrant;
var routeHelper = require('../lib/routeHelper');

exports.register = function(req, res, next){
  console.log('the user is ' + JSON.stringify(req.user));
  var chaReg = {
    challengeId: req.challenge.id,
    userId:  req.user._id.toString(),
    handle: req.user.username.toString(),
    role: 'registered'
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
