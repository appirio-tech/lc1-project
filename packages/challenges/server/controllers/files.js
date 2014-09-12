'use strict';

/**
 * File upload controller
 */

/**
 * Module dependencies.
 */
var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var File = datasource.File;
var fse = require('fs-extra');
var config = require('meanio').loadConfig();
var knox = require('knox');
var routeHelper = require('../lib/routeHelper');

/**
 * Loading storage provider 
 */
var storageProviders = config.storageProviders,
  providerName = config.uploads.storageProvider;
var providerConfig = storageProviders[providerName];

var provider = require(config.root + '/' + providerConfig.path)(providerConfig.options, config);

/**
 * upload file handler
 */
exports.uploadHandler = function(req, res, next) {
  console.log('Upload handler. Upload status ' + JSON.stringify(req.fileUploadStatus));
  var challengeId = req.params.challengeId;
  var title = req.body.title;
  if(!title) {
    // If title is empty add dummy title
    // can return error to client
    title = 'File Title';
  }
  
  // checking upload error
  var err = req.fileUploadStatus.error;
  if(err) {
    routeHelper.addError(req,'UploadFailed', err,req.fileUploadStatus.statusCode);
    return next();
  }
  var fileEntity = req.fileUploadStatus.file;
  if(fileEntity) {
    fileEntity.title = title;
  } else {
    routeHelper.addError(req,'UploadFailed', new Error('Upload Failed'),req.fileUploadStatus.statusCode);
    return next();
  }
  /**
   * saving the file info into database
   */
  File.create(fileEntity).success(function(file) {
    // get challenge for challengeId
    Challenge.find(challengeId).success(function(challenge) {
      // setting challenge association
      file.setChallenge(challenge).success(function(result) {
        return next();
      }).error(function(err) {
        routeHelper.addError(req,'DatabaseError', err);
        return next();
      });
    }).error(function(err) {
      routeHelper.addError(req,'DatabaseError', err);
      return next();
    });
  }).error(function(err) {
    routeHelper.addError(req,'DatabaseError', err);
    return next();
  });
};


/**
 * Delete file handler
 * @param  {Object}       req       Request Object
 * @param  {Object}       res       Response Object
 */
exports.deleteFile = function(req, res, next) {
  var fileId = req.params.fileId;
  File.find(fileId).success(function(file) {
    provider.delete(file, function(err) {
      if(err) {
        routeHelper.addError(req,'InernalServerError', err);
        return next();
      } else {
          // file successfully deleted from resource delete file from DB
          file.destroy().success(function(result) {
          return next();
        }).error(function(err) {
          routeHelper.addError(req,'DatabaseError', err);
          return next();
        });
      }
    });
  }).error(function(err) {
    routeHelper.addError(req,'DatabaseError', err);
    return next();
  });
};
