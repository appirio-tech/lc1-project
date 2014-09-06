/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * Module dependencies.
 */
var postgresql = require('postgresql-sequelize');
var sequelize = postgresql.sequelize;
var Requirement = sequelize.model('Requirement');
var ChallengeRequirement = sequelize.model('ChallengeRequirement');
var async = require('async');
var _ = require('lodash');
var routeHelper = require('../lib/routeHelper');


/**
 * Return the values of enum type by SQL.
 */
function _getEnumTypeValues(type, callback) {
	// sql to get the values of enum type
	var sql = 'SELECT e.enumlabel FROM pg_enum e ' +
  					'JOIN pg_type t ON e.enumtypid = t.oid '+
  					'WHERE t.typname = \''+type+'\'';

  sequelize.query(sql).success(function (results) {
  	var values = [];
  	_.forEach(results, function(value) {
  		values.push(value.enumlabel);
  	});
    callback(null, values);
  })
    .error(function (err) {
    	callback(err);
    });
}

/**
 * Return the list of requirement type values.
 */
exports.requirementTypes = function (req, res, next) {
  _getEnumTypeValues('requirement_type', function (err, values) {
  	if (err) {
  		routeHelper.addError(req, 'DatabaseReadError', err);
  	} else {
    	req.data = values;
    }
    next();
  });
};

/**
 * Return the list of requirement necessity values.
 */
exports.requirementNecessities = function (req, res, next) {
  _getEnumTypeValues('requirement_necessity', function (err, values) {
  	if (err) {
  		routeHelper.addError(req, 'DatabaseReadError', err);
  	} else {
    	req.data = values;
    }
    next();
  });
};

/**
 * Find a requirement by id
 */
exports.challengeRequirement = function (req, res, next, id) {
	async.waterfall([
		function(callback) {
		  ChallengeRequirement.find(id).success(function (challengeRequirement) {
		    if (!challengeRequirement) {
		    	routeHelper.addErrorMessage(req, 'EntityNotFound', 'Cannot find the challengeRequirement with id '+id, 404);
		    } else {
		    	challengeRequirement.dataValues.challenge = req.challenge;
		    }
		  	callback(req.error, challengeRequirement);
		  })
		  .error(function (err) {
		  	routeHelper.addError(req, 'DatabaseReadError', err);
		  	callback(req.error);
		  });
		},
		function(challengeRequirement, callback) {
			Requirement.find(challengeRequirement.requirementId).success(function(requirement){
				if (!requirement) {
					routeHelper.addErrorMessage(req, 'DatabaseReadError', 'Cannot find the requirement with id '+challengeRequirement.requirementId);
				} else {
					challengeRequirement.dataValues.requirement = requirement;
				}
				callback(req.error, challengeRequirement);
			});
		}
	], function(err, challengeRequirement) {
		if (err) return next();

		req.challengeRequirement = challengeRequirement;
		next();
	});

};

/**
 * List of requirements
 */
exports.all = function (req, res, next) {
	async.waterfall([
		function(callback) {
			var filter = {
				where: {challengeId: req.challenge.id}
			};
		  ChallengeRequirement.findAll(filter).success(function (challengeRequirements) {
		  	// uncomment to include challenge in the challengeRequirement
		  	// _.forEach(challengeRequirements, function(challengeRequirement){
		  	// 	challengeRequirement.dataValues.challenge = req.challenge;
		  	// });
		  	callback(null, challengeRequirements);
		  })
		  .error(function (err) {
		  	routeHelper.addError(req, 'DatabaseReadError', err);
		  	callback(req.error);
		  });
		},
		function(challengeRequirements, callback) {
			async.each(challengeRequirements, function(challengeRequirement, cb) {
				Requirement.find(challengeRequirement.requirementId).success(function(requirement) {
					if (!requirement) {
						routeHelper.addErrorMessage(req, 'DatabaseReadError', 'Cannot find the requirement of id '+challengeRequirement.requirementId);
						cb(req.error);
					} else {
						challengeRequirement.dataValues.requirement = requirement;
					}
					cb();
				});
			}, function(err) {
				if (err) {
					routeHelper.addError(req, 'DatabaseReadError', err);
				}
				callback(req.error, challengeRequirements);
			});
		}
	], function(err, challengeRequirements) {
		if (err) return next();

		req.data = challengeRequirements;
		next();
	});
};

/**
 * Create a requirement
 */
exports.create = function (req, res, next) {
	async.waterfall([
		function(callback){
			// req.body has requirement data
		  req.body = _.omit(req.body, 'id', 'createdAt', 'updatedAt');
		  //TODO, hard-code userId for now, req.user._id(MongoDB user.id) can't be used for this.
		  req.body.created_by_user_id = 1; //req.user._id;
		  Requirement.create(req.body).success(function (requirement) {
		    callback(null, requirement);
		  })
		  .error(function (err) {
		  	routeHelper.addError(req, 'DatabaseSaveError', err);
		  	callback(req.error);
		  });
		},
		function(requirement, callback) {
			var challengeRequirementData = {
				challengeId: req.challenge.id,
				requirementId: requirement.id
			};
			ChallengeRequirement.create(challengeRequirementData).success(function (challengeRequirement) {
				// need to set challenge and requirement to dataValues property
				challengeRequirement.dataValues.challenge = req.challenge;
				challengeRequirement.dataValues.requirement = requirement;
				callback(null, challengeRequirement);
			})
			.error(function(err) {
		  	routeHelper.addError(req, 'DatabaseSaveError', err);
		  	callback(req.error);
			});
		},
	], function(err, challengeRequirement) {
		if (err) return next();

		req.data = challengeRequirement;
		next();
	});

};

/**
 * Update a requirement
 */
exports.update = function (req, res, next) {
	if (req.error) return next();

	// req.body has requirement data
	req.body = _.omit(req.body, 'id', 'createdAt', 'updatedAt', 'created_by_user_id');
  var requirement = req.challengeRequirement.dataValues.requirement;
  requirement = _.extend(requirement, req.body);
  requirement.save().success(function () {
  	req.challengeRequirement.dataValues.requirement = requirement;
    req.data = req.challengeRequirement;
    next();
  })
    .error(function (err) {
    	routeHelper.addError(req, 'DatabaseSaveError', err);
    	next();
    });
};

/**
 * Delete a requirement
 */
exports.destroy = function (req, res, next) {
	console.log('destroy: ', req.error);
	if (req.error) return next();

  var challengeRequirement = req.challengeRequirement;
  challengeRequirement.destroy().success(function () {
    req.data = challengeRequirement;
    next();
  })
    .error(function (err) {
    	routeHelper.addError(req, 'DatabaseSaveError', err);
    	next();
    });
};

/**
 * Show a requirement
 */
exports.show = function (req, res, next) {
	if (req.error) return next();

  req.data = req.challengeRequirement;
  next();
};

