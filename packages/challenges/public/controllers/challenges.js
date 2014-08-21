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
          overview: this.overview,
          description: this.description
        });

        if (this.tagList) {
          challenge.tags = [];
          var tags = this.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }

        // convert string to JSON
        try {
          if (this.technicals) {
            challenge.technicalRequirements = JSON.parse(this.technicals);
          }
        } catch (e) {
          $scope.submitted = true;
          $scope.challengeForm.technicals.$invalid = true;
          return;
        }
        try {
          if (this.functionals) {
            challenge.functionalRequirements = JSON.parse(this.functionals);
          }
        } catch (e) {
          $scope.submitted = true;
          $scope.challengeForm.functionals.$invalid = true;
          return;
        }

        challenge.$save(function(response) {
          $location.path('challenges/' + response.id);
        });

        this.title = '';
        this.startDate = '';
        this.ednDate = '';
        this.tagList = '';
        this.overview = '';
        this.description = '';
        this.technicals = '';
        this.functionals = '';
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

        if (challenge.tagList) {
          challenge.tags = [];
          var tags = challenge.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }
        // convert back string to JSON
        try {
          if (challenge.technicals) {
            challenge.technicalRequirements = JSON.parse(challenge.technicals);
          }
        } catch (e) {
          $scope.submitted = true;
          $scope.challengeForm.technicals.$invalid = true;
          return;
        }
        try {
          if (challenge.functionals) {
            challenge.functionalRequirements = JSON.parse(challenge.functionals);
          }
        } catch (e) {
          $scope.submitted = true;
          $scope.challengeForm.functionals.$invalid = true;
          return;
        }
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
        // convert JSON to string
        if (challenge.tags) {
          challenge.tagList = challenge.tags.join(',');
        }
        if (challenge.technicalRequirements) {
          challenge.techicals = JSON.stringify(challenge.technicalRequirements);
        }
        if (challenge.functionalRequirements) {
          challenge.functionals = JSON.stringify(challenge.functionalRequirements);
        }
        $scope.challenge = challenge;
      });
    };

    $scope.renderHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    $scope.selectItem = function(selectedItem) {
      console.log('selected one' + selectedItem);
      angular.forEach($scope.challenges, function(item) {
        console.log(' do the forEach');
        item.selected = false;
        if (selectedItem === item) {
          $scope.selected = item;
          selectedItem.selected = true;
        }
      });
    };





  }
]);
