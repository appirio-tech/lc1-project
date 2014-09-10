'use strict';

module.exports = {

  /**
   * Uploads configuration
   * If local storage will be false then application by defaults initialize S3 upload service
   * For local storage uploadsDirectory is mandatory.
   * If temp directory is not given it will default to os.tempdir()
   *
   * For s3 upload configuration
   * key, secret bucket and region properties are mandatory
   * @type {Object}
   */
  uploads : {
    isLocalStorage : true,
    uploadsDirectory : './uploads',
    tempDir : './temp',
    /**
     * Constant representing Local storage type
     * @type {Number}
     */
    localStorage : 1,
    /**
     * Constant representing S3 Storage type
     * @type {Number}
     */
    s3Storage : 2
  },
  /**
   * AWS configuration for s3 upload service
   * @type {Object}
   */
  aws : {
    secure: false,
    key: 'AKIAJZS2NZA4O6QGYWJA',
    secret: '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',
    bucket: 'challenge-api',
    region : 'ap-southeast-1'
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
  postgresurl : 'postgres://idgimrogqewzfg:-C6oh1ld9u_pm4201sctLVqPwX@ec2-54-197-250-52.compute-1.amazonaws.com/dc6c3p1lnfqrvo',
  pg: {
     database: 'dc6c3p1lnfqrvo',
     username: 'idgimrogqewzfg',
     password: '-C6oh1ld9u_pm4201sctLVqPwX',
     host: 'ec2-54-197-250-52.compute-1.amazonaws.com',
     dialect: 'postgres',
     port: 5432
  }
};
