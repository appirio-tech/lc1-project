/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
* Defining ChallengeRegistrant model
*/
module.exports = function(sequelize, DataTypes) {

  var ChallengeRegistrant = sequelize.define('ChallengeRegistrant', {
    challengeId: DataTypes.INTEGER,
    userId: DataTypes.STRING(32),
    handle: DataTypes.STRING(32),
    role: DataTypes.STRING(32)
  }, {tableName: 'challenge_registrants'});

  return ChallengeRegistrant;
};
