'use strict';

/**
 * Amazon s3 storage provider.
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
var multiparty = require('multiparty'),
  knox = require('knox'),
  Batch = require('batch'),
  /**
   * HTTP OK STATUS CODE
   * @type {Number}
   */
  HTTP_OK = 200,

  /**
   * HTTP NO CONTENT STATUS CODE
   */
  HTTP_NO_CONTENT = 204;

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

module.exports = function(options, config) {
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

  var provider = {};

  /**
   * Storage provider store implementation
   * @param  {Object}       req       Request object
   * @param  {Object}       res       Response object
   * @param  {Function}     next      Next function
   */
  provider.store = function(req, res, next) {
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
        storageType : options.id
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
    // s3 storage delete s3 object
    s3Client.del(file.filePath).on('response', function(res) {
      if(res.statusCode === HTTP_OK || res.statusCode === HTTP_NO_CONTENT) {
        // File deleted from s3
        callback(null);
      } else {
        callback(new Error('Failed to delete s3 file'));
      }
    }).end();

  };
  return provider;
};
