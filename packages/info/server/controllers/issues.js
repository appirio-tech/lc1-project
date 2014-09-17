'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('mongoose'),
//    Datapoint = mongoose.model('Datapoint');
//
//var _ = require('lodash');
var https = require('https');



exports.issues = function (options, res, error) {
    var req;
        options = {
        host: 'api.github.com',
        path: '/repos/topcoderinc/serenity-core/issues?state=all',
        data: '',
        method: 'get',
        headers: {'User-Agent': 'kbowerma'}
    };
    var data = options.data;
    var method = options.method.toLowerCase();
    delete options.data;
    // host and path is manatory
    if (!options.host || !options.path) {
        console.log(' [Error in API request] both host and path are required');
        return;
    }
    // if the data is object, covert it to a json string.
    if (typeof data === 'object') data = JSON.stringify(data);
    // set Content-Length and Content-Type in case of post request.
    if (method !== 'get') {
        var headers = options.headers;
        headers['Content-Length'] = data.length;
        if (!headers['Content-Type']) headers['Content-Type'] = 'application/json';
    }
    // sends http request
    req = https.request(options, function (response) {
        var body = '';
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
            body += chunk;
        });
        response.on('end', function () {
            var data = null;
            // console.log(" => Response : ", body);
            if (body) {
                try {
                    data = JSON.parse(body);
                }
                catch (err) {
                    data = body;
                }
            }
            if (res) res.json(data);
        });
    });
    req.on('error', function (err) {
        console.log(' => Error while API request : ', err);
        if (error) error(err);
    });
    // if there is data to send
    if (method !== 'get' && data.length > 0) {
        req.write(data);
    }
    req.end();
};
