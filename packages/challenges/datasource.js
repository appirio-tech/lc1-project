'use strict';
var datasource = {};

/**
* This function will initializes datasource with all the models present in models directory
* @param {Object} config Global configuration object
* @param {Function} callback Callback function
*/
datasource.init = function(config) {
  this.db = require('./server/models')(config);
};

/**
* Return the initialized datasource.
* @return {Object} Datasource Object
*/
datasource.getDataSource = function() {
  return this.db;
};

/**
* Exporting module
*/
module.exports = datasource;