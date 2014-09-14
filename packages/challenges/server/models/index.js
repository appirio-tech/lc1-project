'use strict';
module.exports = function(config) {
  var fse = require('fs-extra'),
    path = require('path'),
    Sequelize = require('sequelize'),
    lodash = require('lodash');

    // reading config.
    var postgresurl = config.pgURL || (config.pg.dialect +'://' + config.pg.username + ':' + config.pg.password + '@' + config.pg.host + ':' + config.pg.port + '/' + config.pg.database);
    var sequelize = new Sequelize(postgresurl, config.pg),
    db = {};

    // Add JSON and JSONB data type to Sequelize
    Sequelize.JSON = 'JSON';
    Sequelize.JSONB = 'JSONB';

    fse.readdirSync(__dirname).filter(function(file) {
      return ((file.indexOf('.' ) !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
    }).forEach(function(file) {
      var model = sequelize.import(path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].options.hasOwnProperty('associate')) {
      db[modelName].options.associate(db);
    }
  });
  return lodash.extend({sequelize: sequelize, Sequelize: Sequelize}, db);
};
