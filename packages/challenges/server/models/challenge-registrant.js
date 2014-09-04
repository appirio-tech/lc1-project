/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


var postgresql = require('postgresql-sequelize');
var Sequelize = postgresql.Sequelize;
var DataTypes = Sequelize;
var sequelize = postgresql.sequelize;

// ChallengeRequirement model
sequelize.define('ChallengeRegistrant', {
    challengeId: DataTypes.INTEGER,
    userId: DataTypes.STRING(32)
  },
  {'tableName': 'challenge_registrants'}
);
