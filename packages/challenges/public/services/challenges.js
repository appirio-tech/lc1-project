/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


// Challenges service used for challenges REST endpoint
angular.module('mean.challenges').factory('Challenges', ['$resource',
  function($resource) {
    return $resource('challenges/:challengeId', {
      challengeId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);
