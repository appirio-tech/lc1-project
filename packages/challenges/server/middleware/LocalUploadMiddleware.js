'use strict';

var uploadDirectory,
  fse = require('fs-extra'),
  multiparty = require('multiparty');

var checkOptions = function(options) {
  // check options for local storage configuration
  if(!options.uploads.uploadsDirectory) {
    return new Error('uploadsDirectory configuration is needed for local storage');
  }
};

module.exports = function(options) {
  var err = checkOptions(options);
  if(err) {
    throw err;
  }
  uploadDirectory = options.root + '/' + options.uploads.uploadsDirectory;
  var middleware = function(req, res, next) {
    var fileUploadStatus = {};
    var form;
    if(options.uploads.tempDir) {
      form = new multiparty.Form({uploadDir : options.root + '/' + options.uploads.tempDir});
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
          storageType : options.uploads.localStorage
        };

      fileUploadStatus.file = file;
      // move file
      fse.move(tmpPath, targetPath, function(err) {
        if(err) {
          fileUploadStatus.error = err;
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
  return middleware;
}:
