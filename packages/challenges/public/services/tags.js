/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


// Challenges service used for challenges REST endpoint
angular.module('mean.challenges')
.factory('Tags', ['$resource',
  function($resource) {
    return $resource('tags', {}, {
      create: {
        method: 'POST'
      },
      query: {
          method: 'GET',
          isArray: true
      }
    });
  }
]);