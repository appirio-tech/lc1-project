/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


var postgresql = require('postgresql-sequelize');
var Sequelize = postgresql.Sequelize;
var sequelize = postgresql.sequelize;


sequelize.define('Challenge', {
	startDate: Sequelize.DATE,
	endDate: Sequelize.DATE,
	title: {type: Sequelize.TEXT, allowNull: false, unique: true},
	overview: Sequelize.TEXT,	// rich text
	description: Sequelize.STRING(140),
	functionalRequirements: {
		type: Sequelize.JSON, 	// JSON
		set: function(value) {
			return this.setDataValue('functionalRequirements', JSON.stringify(value));
		}
	},
	technicalRequirements: {
		type: Sequelize.JSONB, 	// JSONB
		set: function(value) {
			return this.setDataValue('technicalRequirements', JSON.stringify(value));
		},
		// JSONB type return string, so it requires JSON.parse.
		get: function() {
			return JSON.parse(this.getDataValue('technicalRequirements'));
		}
	},
	tags: Sequelize.ARRAY(Sequelize.TEXT)	// Array of Text

});

// sync with database
sequelize
	.sync({force: false})
	.complete(function(err) {
		if (!!err) {
			console.log('An error occurred while syncing database:', err);
		} else {
			console.log('Database is synced!');
		}
	});







