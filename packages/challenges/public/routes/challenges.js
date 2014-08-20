/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


//Setting up route
angular.module('mean.challenges').config(['$stateProvider',
  function($stateProvider) {
    // Check if the user is connected
    var checkLoggedin = function($q, $timeout, $http, $location) {
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user) {
        // Authenticated
        if (user !== '0') $timeout(deferred.resolve);

        // Not Authenticated
        else {
          $timeout(deferred.reject);
          $location.url('/login');
        }
      });

      return deferred.promise;
    };

    // states for my app
    $stateProvider
      .state('all challenges', {
        url: '/challenges',
        templateUrl: 'challenges/views/list.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('all challenges multi', {
        url: '/challenges-multi',
        templateUrl: 'challenges/views/listmultiview.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('create challenge', {
        url: '/challenges/create',
        templateUrl: 'challenges/views/create.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('edit challenge', {
        url: '/challenges/:challengeId/edit',
        templateUrl: 'challenges/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('challenge by id', {
        url: '/challenges/:challengeId',
        templateUrl: 'challenges/views/view.html',
        resolve: {
          loggedin: checkLoggedin
        }
      });
  }
]);