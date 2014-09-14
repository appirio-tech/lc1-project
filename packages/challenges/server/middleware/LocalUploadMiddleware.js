'use strict';

/**
 * Local storage provider.
 * A storage provider should implement atleast following two methods
 *
 * /**
 *  * Store method. It will store the file based on the service provided by this provided
 *  * This method will set the request object property fileUploadStatus
 *  * fileUploadStatus : {
 *  *   file : {
 *  *      filePath : ''
 *  *      tempPath : ''
 *  *      fileName : ''
 *  *      size : ''
 *  *      storageType : ''
 *  *   }
 *  *   err : Describes the error in case there is one
 *  *   statusCode : remote server status code
 *  * }
 *  *
 * function store(req,res,next) {
 *   // do something store the file and set the request object
 * }
 *
 * /**
 * * Delete handleer. This method delete the specified file from resource
 * * @param  {File}           file              The file object to delete
 * * @param  {Function}       callback          Callback function
 * *
 * * The signature of callback function
 * *
 * * function callback(err) {
 * *   if(err) {
 * *      // error occured during delete
 * *   } else {
 * *     // deleted successfully. Proceed
 * *   }
 * * }
 *
 * function delete(file, callback) {
 *   // do something. Delete file from resource
 * }
 *
 *
 *
 */


/**
 * Module dependencies
 */
var uploadDirectory,
  fse = require('fs-extra'),
  multiparty = require('multiparty');


var checkOptions = function(options) {
  // check options for local storage configuration
  if(!options.uploadsDirectory) {
    return new Error('uploadsDirectory configuration is needed for local storage');
  }
};

module.exports = function(options, config) {
  var err = checkOptions(options);
  if(err) {
    throw err;
  }
  uploadDirectory = config.root + '/' + options.uploadsDirectory;
  var provider = {};

  /**
   * Storage provider store implementation
   * @param  {Object}       req       Request object
   * @param  {Object}       res       Response object
   * @param  {Function}     next      Next function
   */
  provider.store = function(req, res, next) {
    var fileUploadStatus = {};
    var form;
    if(options.tempDir) {
      form = new multiparty.Form({uploadDir : config.root + '/' + options.tempDir});
    } else {
      form = new multiparty.Form();
    }
    form.on('file', function(name, receivedFile) {
      var tmpPath = receivedFile.path,
        fileName = receivedFile.originalFilename,
        targetDirectory = uploadDirectory + '/' + 'challenges' + '/' + req.params.challengeId,
        targetPath = targetDirectory + '/' + fileName,
        file = {
          filePath : targetPath,
          tempPath : tmpPath,
          fileName : fileName,
          size : receivedFile.size,
          // Unique id for this storage provider
          storageType : options.id
        };
      fileUploadStatus.file = file;
      // move file
      fse.move(tmpPath, targetPath, function(err) {
        if(err) {
          fileUploadStatus.err = err;
          console.log('Error moving file [ ' + targetPath + ' ] ' + JSON.stringify(err));
        }
        return next();
      });
    });

    form.on('error', function(err) {
      fileUploadStatus.err = err;
      req.fileUploadStatus = fileUploadStatus;
      return next();
    });

    form.on('close', function() {
      req.fileUploadStatus = fileUploadStatus;
    });
    form.on('field', function(name, value) {
      req.body = req.body || {};
      req.body[name] = value;
    });
    // parsing form
    form.parse(req);
  };

  /**
   * Delete handleer. This method delete the specified file from resource
   * @param  {File}           file              The file object to delete
   * @param  {Function}       callback          Callback function
   *
   * The signature of callback function
   *
   * function callback(err) {
   *   if(err) {
   *      // error occured during delete
   *   } else {
   *     // deleted successfully. Proceed
   *   }
   * }
   */
  provider.delete = function(file, callback) {
    if(!file.filePath) {
      callback(new Error('Invalid file'));
      return;
    }
    fse.remove(file.filePath, function(err) {
      callback(err);
    });
  };

  return provider;
};
