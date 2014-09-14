/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
* Defining ChallengeRequirement model
*/
module.exports = function(sequelize, DataTypes) {

  var ChallengeRequirement = sequelize.define('ChallengeRequirement', {
    challengeId: DataTypes.INTEGER,
    requirementId: DataTypes.INTEGER
  }, {tableName: 'challenge_requirements'});

  return ChallengeRequirement;
};