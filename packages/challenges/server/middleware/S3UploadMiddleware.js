'use strict';

var multiparty = require('multiparty'),
  knox = require('knox'),
  Batch = require('batch'),
  /**
   * HTTP OK STATUS CODE
   * @type {Number}
   */
  HTTP_OK = 200;

var headers = {
  'x-amz-acl': 'public-read',
};

var checkOptions = function(options) {
  // check options for AMAZON S3 upload service
  if(!options.aws.key || !options.aws.secret || !options.aws.bucket || !options.aws.region) {
    return new Error('Access Key, Access Secret, bucket and region configuration are mandatory for AWS upload service');
  }
};

function onEnd() {
  console.log('Multi part form parsed successfully');
}

module.exports = function(options) {
  var err = checkOptions(options);
  if(err) {
    throw err;
  }

  /**
   * Creating knox s3 client
   */
  var s3Client = knox.createClient({
    secure: options.aws.secure,
    key: options.aws.key,
    secret: options.aws.secret,
    bucket: options.aws.bucket,
    region: options.aws.region
  });

  var middleware = function(req, res, next) {
    var form = new multiparty.Form(),
      batch = new Batch();
    /**
     * Parsing multi part form field user_id
     * This middleware assumes that user_id will be passed as form field, the last field should be file
     * @param  {Function}   cb      callback function
     */
    batch.push(function(cb) {
      form.on('field', function(name, value) {
        req.body = req.body || {};
        req.body[name] = value;
        cb(null, '');
      });
    });
    batch.push(function(cb) {
      form.on('part', function(part) {
        if (!part.filename) {
          return;
        }
        cb(null, part);
      });
    });

    var fileUploadStatus= {};

    batch.end(function(err, results) {
      if(err) {
        fileUploadStatus.error = err;
      }
      form.removeListener('close', onEnd);
      var part = results[1];
      var fileName = part.filename;
      headers['Content-Length'] = part.byteCount;
      var targetPath = '/challenges' + '/' + req.params.challengeId + '/' + fileName;
      var file = {
        filePath : targetPath,
        tempPath : '',
        fileName : fileName,
        size : part.byteCount,
        storageType : options.uploads.s3Storage
      };

      s3Client.putStream(part, targetPath, headers, function(err, s3Response) {
        if (err) {
          fileUploadStatus.err = err;
          fileUploadStatus.statusCode = s3Response.statusCode;
        } else {
          console.log('s3 response code' + s3Response.statusCode);
          if(s3Response.statusCode === HTTP_OK) {
            fileUploadStatus.file = file;
          } else {
            // S3 response code is not HTTP OK error occured during upload
            fileUploadStatus.err = new Error('Upload failed');
            fileUploadStatus.statusCode = s3Response.statusCode;
          }
        }
        req.fileUploadStatus = fileUploadStatus;
        next();
      });
    });
    form.on('close', onEnd);
    form.parse(req);
  };

  return middleware;
};
