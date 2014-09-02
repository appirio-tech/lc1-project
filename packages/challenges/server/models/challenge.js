/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


var postgresql = require('postgresql-sequelize');
var Sequelize = postgresql.Sequelize;
// var DataTypes = Sequelize;
var sequelize = postgresql.sequelize;

// Challenge model
sequelize.define('Challenge', {
    regStartDate: Sequelize.DATE,
    subEndDate: Sequelize.DATE,
    title: {
      type: Sequelize.STRING(128),
      validate: {
        notNull: true,
        notEmpty: true
      }
    },
    type: Sequelize.STRING(32),
    overview: Sequelize.STRING(140),
    description: Sequelize.TEXT,
    registeredDescription: Sequelize.TEXT,
    tags: Sequelize.ARRAY(Sequelize.TEXT)
  },
  {tableName: 'challenges'}
);

// // Requirement model
// var Requirement = sequelize.define('Requirement', {
//     type: {type: 'requirement_type', allowNull: false},
//     necessity: {type: 'requirement_neccesity', allowNull: false},
//     body: {type: DataTypes.TEXT, allowNull: false},
//     score_min: {type: DataTypes.INTEGER, allowNull: false},
//     score_max: {type: DataTypes.INTEGER, allowNull: false},
//     created_by_user_id: {type: DataTypes.INTEGER, allowNull: false},
//     is_private: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
//     difficulty: {type: DataTypes.INTEGER, allowNull: false},
//     tags: DataTypes.ARRAY(DataTypes.TEXT),
//     textsearchable_body: 'tsvector',
//     is_in_library: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
//     weight: {type: DataTypes.DECIMAL(5, 3), allowNull: false, defaultValue: 1},
//   }, 
//   {'tableName': 'requirements'}
// );

// // ChallengeRequirement model
// var ChallengeRequirement = sequelize.define('ChallengeRequirement', {

//   }, 
//   {'tableName': 'challenge_requirements'}
// );


// set the association

// Challenge.hasMany(ChallengeRequirement);
// Requirement.hasMany(ChallengeRequirement);

// ChallengeRequirement.belongsTo(Challenge);
// ChallengeRequirement.belongsTo(Requirement);


