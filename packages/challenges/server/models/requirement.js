/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


var postgresql = require('postgresql-sequelize');
var Sequelize = postgresql.Sequelize;
var DataTypes = Sequelize;
var sequelize = postgresql.sequelize;

// Requirement model
sequelize.define('Requirement', {
    type: {type: 'requirement_type', allowNull: false},
    necesity: {type: 'requirement_necesity'},
    body: {type: DataTypes.TEXT, allowNull: false},
    score_min: {type: 'smallint', allowNull: false},
    score_max: {type: 'smallint', allowNull: false},
    created_by_user_id: {type: DataTypes.INTEGER, allowNull: false},
    is_private: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true},
    difficulty: {type: DataTypes.INTEGER},
    tags: DataTypes.ARRAY(DataTypes.TEXT),
    textsearchable_body: 'tsvector',
    is_in_library: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false},
    weight: {type: DataTypes.DECIMAL(5, 3), allowNull: false, defaultValue: 1},
  }, 
  {'tableName': 'requirements'}
);