'use strict';

if (!global.hasOwnProperty('db')) {
  var Sequelize = require('sequelize');
  var sequelize = null;
  var config = require('meanio').loadConfig();

  if (config.pg.heroku_link) {
    // the application is executed on Heroku ... use the postgres database
    var match = config.pg.heroku_link.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);

    sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  true //false
    });
  } else {
    // Create connection handle
    sequelize = new Sequelize(
      config.pg.database,
      config.pg.username, '', {
        dialect: config.pg.dialect,
        port:    config.pg.port}
    );
  }

  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    Challenge: sequelize.import(__dirname + '/challenge')
  };
}

module.exports = global.db;
