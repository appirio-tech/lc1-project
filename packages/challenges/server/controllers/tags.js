/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var Tag = datasource.Tag;
var routeHelper = require('../lib/routeHelper');

exports.create = function(req, res, next){
  var tag = req.body;
  Tag.findOrCreate(tag).success(function(tag, created){
    if(!created)
      routeHelper.addValidationError(req, 'Tag already registered');
    req.data = tag;
    next();
  }).error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};

exports.all = function(req, res, next){
  Tag.findAll().success(function(data){
    req.data = data;
    next();
  })
  .error(function(err){
    routeHelper.addError(req, 'DatabaseSaveError', err);
    next();
  });
};
