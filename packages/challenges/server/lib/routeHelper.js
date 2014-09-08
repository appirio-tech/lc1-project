/*
 * Copyright (C) 2014 TopCoder Inc., All Rights Reserved.
 */

/**
 * This module provides helper methods for creating express controllers.
 *
 * @version 1.0
 * @author TCSASSEMBLER
 */
'use strict';


var _ = require('lodash');

/**
 * Add Error object to request.
 * @param req the request
 * @param errName the error name
 * @param err the origianl Error
 * @param errCode the error code
 */
exports.addError = function(req, errName, err, errCode) {
    req.error = err;
    req.error.name = errName;
    req.error.responseCode = errCode || 500;
};

/**
 * Add error name and message to request.
 * @param req the request
 * @param errName the error name
 * @param errMsg the error message
 * @param errCode the error code
 */
exports.addErrorMessage = function(req, errName, errMsg, errCode) {
    if (!req.error) req.error = {};
    req.error.message = errMsg;
    req.error.name = errName;
    req.error.responseCode = errCode || 500;
};

/**
 * Add validation error to request.
 * @param req the request
 * @param errMsg the error message
 * @param errCode the error code
 */
exports.addValidationError = function(req, errMsg, errCode) {
    if (!req.error) {
        req.error = {};
        req.error.name = 'ValidationError';
        req.error.responseCode = 400;
    }
    if (!req.error.errors) req.error.errors = [];

    req.error.errors.push(new Error(errMsg));
};

/**
 * This method renders result (req.error or req.data) as JSON.
 * @param req the request
 * @param res the response
 * @param next the next function in the chain
 */
exports.renderJson = function(req, res, next) {
    if (req.error) {
        // console.log('Sending back error response : ', req.error);
        if (req.error.name === 'ValidationError') {
            res.status(400).json({
                error : {
                    name : req.error.name,
                    message : _.pluck(_.values(req.error.errors), 'message').join(', ')
                }
            });
        } else {
            res.status(req.error.responseCode).json({
                error : {
                    name : req.error.name,
                    message : req.error.message
                }
            });
        }
    } else {
        res.status(200).json(req.data);
    }
};

/**
 * This method checks the content-type of request is multipart/form-data.
 * @param req the request
 */
exports.isFormData = function(req) {
  var type = req.headers['content-type'] || '';
  return 0 === type.indexOf('multipart/form-data');
};

