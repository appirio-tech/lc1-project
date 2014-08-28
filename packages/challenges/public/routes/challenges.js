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
      .state('challenges', {
        abstract: true,
        url: '/challenges',
        controller: 'ChallengesBaseController',
        template: '<div data-ui-view></div>'
      })
      .state('challenges.all', {
        url: '',
        templateUrl: 'challenges/views/list.html'
      })
      .state('challenges.multi', {
        url: '/multi',
        templateUrl: 'challenges/views/listmultiview.html'
      })
      .state('challenges.new', {
        url: '/new',
        templateUrl: 'challenges/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('challenges.edit', {
        url: '/:challengeId/edit',
        templateUrl: 'challenges/views/edit.html',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .state('challenges.view', {
        url: '/:challengeId',
        templateUrl: 'challenges/views/view.html'
      });
  }
]);
