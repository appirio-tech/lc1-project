/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


var postgresql = require('postgresql-sequelize');
var Sequelize = postgresql.Sequelize;
var sequelize = postgresql.sequelize;


sequelize.define('challenge', {
  regStartDate: Sequelize.DATE,
  subEndDate: Sequelize.DATE,
  title: Sequelize.STRING(128),
  type: Sequelize.STRING(32),
  overview: Sequelize.STRING(140),
  description: Sequelize.TEXT,
  registeredDescription: Sequelize.TEXT,
  tags: Sequelize.ARRAY(Sequelize.TEXT)
},
{tableName: 'challenges'});

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
