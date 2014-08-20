/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', '$sce', 'Global', 'Challenges',
  function($scope, $stateParams, $location, $sce, Global, Challenges) {
    $scope.global = Global;

    $scope.create = function(isValid) {
      if (isValid) {
        var challenge = new Challenges({
          title: this.title,
          startDate: this.startDate,
          endDate: this.endDate,
          summary: this.summary,
          description: this.description
        });

        challenge.$save(function(response) {
          $location.path('challenges/' + response.id);
        });

        this.title = '';
        this.startDate = '';
        this.endDate = '';
        this.summary = '';
        this.description = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(challenge) {
      if (challenge) {
        challenge.$remove();

        for (var i in $scope.challenges) {
          if ($scope.challenges[i] === challenge) {
            $scope.challenges.splice(i, 1);
          }
        }
      } else {
        $scope.challenge.$remove(function(response) {
          $location.path('challenges');
        });
      }
    };

    $scope.update = function(isValid) {

      if (isValid) {
        var challenge = $scope.challenge;

        challenge.$update(function() {
          $location.path('challenges/' + challenge.id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Challenges.query(function(challenges) {
        $scope.challenges = challenges;
      });
    };

    $scope.findOne = function() {
      Challenges.get({
        challengeId: $stateParams.challengeId
      }, function(challenge) {
        window.ch = challenge;

        $scope.challenge = challenge;
      });
    };

    $scope.renderHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

   $scope.selectItem = function(item) {
     $scope.selected = item;
     $scope.challenge.selected = true;
   };

  }
]);
