/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
* Defining Account model
*/
module.exports = function(sequelize, DataTypes) {

  var Account = sequelize.define('Account', {
    accountId:  DataTypes.STRING(32),
    name:       DataTypes.STRING(32)
  }, {tableName: 'accounts'});

  return Account;
};