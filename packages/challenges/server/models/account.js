/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
* Defining Account model
*/
module.exports = function(sequelize, DataTypes) {

  var Account = sequelize.define('Account', {
    accountId:  { type: DataTypes.STRING(32), primaryKey: true},
    name:       DataTypes.STRING(32)
  }, {tableName: 'accounts',
    associate : function(models) {
      Account.hasMany(models.Challenge);
    }
  });

  return Account;
};
