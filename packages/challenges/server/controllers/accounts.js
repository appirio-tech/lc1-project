/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var Account = datasource.Account;
var routeHelper = require('../lib/routeHelper');

exports.create = function(req, res, next){
  var account = req.body;
  Account.findOrCreate(account).success(function(account, created){
    if(!created)
      routeHelper.addValidationError(req, 'Account already registered');
    req.data = account;
    next();
  }).error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};

exports.all = function(req, res, next){
  var query = req.params.queryKey;
  Account.findAll({where: ['"accountId" like \'' + query + '%\'']}).success(function(data){
    req.data = data;
    next();
  })
  .error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};
