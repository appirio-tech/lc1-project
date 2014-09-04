/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


// Challenges service used for challenges REST endpoint
angular.module('mean.challenges')
.factory('Challenges', ['$resource',
  function($resource) {
    return $resource('challenges/:challengeId', {
      challengeId: '@id'
    }, 
    {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('ChallengeLaunch', ['$resource',
  function($resource) {
    return $resource('challenges/:challengeId/launch', {
      challengeId: '@id'
    }, 
    {
      launch: {
        method: 'POST'
      }
    });
  }
])
.factory('ChallengeRequirements', ['$resource',
  function($resource) {
    return $resource('challenges/:challengeId/requirements/:requirementId', {
    	challengeId: '@id',
      requirementId: '@id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
])
.factory('ChallengeRegistrants', ['$resource',
  function($resource) {
    return $resource('challenges/:challengeId/register', {
      challengeId: '@id'
    },
    {
      register: {
        method: 'POST'
      }
    });
  }
]);
