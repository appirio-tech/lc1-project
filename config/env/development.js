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
  db: 'mongodb://heroku_app28672932:lbjk306k1jr7r13g25sbj3a1rr@ds063809.mongolab.com:63809/heroku_app28672932',
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
    database: 'dc6c3p1lnfqrvo',
    username: 'idgimrogqewzfg',
    password: '-C6oh1ld9u_pm4201sctLVqPwX',
    host: 'ec2-54-197-250-52.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432
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
