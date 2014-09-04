'use strict';

var routeHelper = require('../lib/routeHelper');

/**
 * Launch a challenge
 */
exports.launch = function (req, res, next) {
  var challenge = req.challenge;
  console.log(JSON.stringify(challenge));
  var regStartDateBeforeSubEndDate = new Date(challenge.regStartDate) < new Date(challenge.subEndDate);
  var subEndDateAfterNow = new Date(challenge.subEndDate) > Date.now();
  if (!regStartDateBeforeSubEndDate) {
    req.data = {error: 'regStartDateBeforeSubEndDate'};
    next();
  } else if (!subEndDateAfterNow) {
    req.data = {error: 'subEndDateAfterNow'};
    next();
  } else {
    challenge.status = 'started';
    challenge.save().success(function (challenge) {
      req.data = {};
      next();
    })
    .error(function (err) {
      routeHelper.addError(req, 'DatabaseSaveError', err);
      next();
    });
  }
};