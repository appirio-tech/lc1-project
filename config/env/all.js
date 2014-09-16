'use strict';

var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  hostname: process.env.HOST || process.env.HOSTNAME,
  db: process.env.MONGOHQ_URL,
  templateEngine: 'swig',

  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  sessionSecret: 'MEAN',
  pg: { dialect: 'postgres'},

  // The name of the MongoDB collection to store sessions in
  sessionCollection: 'sessions',

  // The session cookie settings
  sessionCookie: {
    path: '/',
    httpOnly: true,
    // If secure is set to true then it will cause the cookie to be set
    // only when SSL-enabled (HTTPS) is used, and otherwise it won't
    // set a cookie. 'true' is recommended yet it requires the above
    // mentioned pre-requisite.
    secure: false,
    // Only set the maxAge to null if the cookie shouldn't be expired
    // at all. The cookie will expunge when the browser is closed.
    maxAge: null
  },

  // The session cookie name
  sessionName: 'connect.sid',

  /**
   * Storage providers can be configured here
   * A storage provider should support two operations
   * store and delete
   * @type {Object}
   */
  storageProviders : {
    local: {
      /**
       * This path is needed to load the provider during application load
       * @type {String}
       */
      path: './packages/challenges/server/middleware/LocalUploadMiddleware',
      options: {
        /**
         * Unique Id for this storage provider
         * NOTE: Every storage provider should have a unique id
         * @type {Number}
         */
        id: 1,
        /**
         * These are upload directories for local storage provider
         * @type {String}
         */
        uploadsDirectory: './uploads',
        tempDir: './temp'
      }
    },
    amazonS3: {
      path: './packages/challenges/server/middleware/S3UploadMiddleware',
      options: {
        /**
         * This path is needed to load the provider during application load
         * @type {String}
         */
        id: 2,
        /**
         * AWS configuration for s3 upload service
         * @type {Object}
         */
        aws: {
          secure: false,
          key: 'KEY',
          secret: 'SECRET_KEY',
          bucket: 'bucket',
          region: 'region'
        }
      }
    }
  }
};
