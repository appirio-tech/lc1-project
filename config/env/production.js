'use strict';

module.exports = {
  /**
   * Uploads configuration
   * @type {Object}
   */
  uploads : {
    /**
     * Should be configured in storageProviders
     * @type {String}
     */
    storageProvider : 'local'
  },
  db: process.env.MONGOLAB_URI,
  app: {
    name: '[topcoder serenity]'
  },
  facebook: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
  },
  twitter: {
    clientID: 'CONSUMER_KEY',
    clientSecret: 'CONSUMER_SECRET',
    callbackURL: 'http://localhost:3000/auth/twitter/callback'
  },
  github: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  google: {
    clientID: 'APP_ID',
    clientSecret: 'APP_SECRET',
    callbackURL: 'http://localhost:3000/auth/google/callback'
  },
  linkedin: {
    clientID: 'API_KEY',
    clientSecret: 'SECRET_KEY',
    callbackURL: 'http://localhost:3000/auth/linkedin/callback'
  },
  emailFrom: 'SENDER EMAIL ADDRESS', // sender address like ABC <abc@example.com>
  mailer: {
    service: 'SERVICE_PROVIDER',
    auth: {
      user: 'EMAIL_ID',
      pass: 'PASSWORD'
    }
  },
  pg: {
    // Not needed in production.  Code reads from DATABASE_URL env variable
  },
  /**
   * Storage providers can be configured here
   * A storage provider should support two operations
   * store and delete
   * @type {Object}
   */
  storageProviders : {
    local : {
      /**
       * This path is needed to load the provider during application load
       * @type {String}
       */
      path : './packages/challenges/server/middleware/LocalUploadMiddleware',
      options : {
        /**
         * Unique Id for this storage provider
         * NOTE: Every storage provider should have a unique id
         * @type {Number}
         */
        id : 1,
        /**
         * These are upload directories for local storage provider
         * @type {String}
         */
        uploadsDirectory : './uploads',
        tempDir : './temp'
      }
    },
    amazonS3 : {
      path : './packages/challenges/server/middleware/S3UploadMiddleware',
      options : {
        /**
         * This path is needed to load the provider during application load
         * @type {String}
         */
        id: 2,
        /**
         * AWS configuration for s3 upload service
         * @type {Object}
         */
        aws : {
          secure: false,
          key: 'KEY',
          secret: 'SECRET_KEY',
          bucket: 'bucket',
          region : 'region'
        }
      }
    }
  }
};
