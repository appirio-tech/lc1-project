/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges')
.controller('ChallengesBaseController', ['$scope', '$http', '$timeout', 'Global', function($scope, $http, $timeout, Global) {

    $scope.global = Global;
    $scope.alerts = [];
    $http.get('/clientConfig').success(function(config) {
      $scope.config = config;
    });

    // methods to manage alerts

    $scope.addAlert = function(type, message) {
      $scope.alerts.push({type: type, msg: message});
      // when alertClearTimeout is set, clear alert with timeout
      if ($scope.config && $scope.config.alertClearTimeout && $scope.config.alertClearTimeout > 0) {
        $timeout($scope.clearAlerts, $scope.config.alertClearTimeout*1000);
      }
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };

    $scope.clearAlerts = function() {
      while ($scope.alerts.length > 0) {
        $scope.alerts.pop();
      }
    };

}])
.controller('ChallengesController', 
    ['$scope', '$http', '$timeout', '$state', '$stateParams', '$location', '$sce', 'Challenges',
  function($scope, $http, $timeout, $state, $stateParams, $location, $sce, Challenges) {

    $scope.autosave = {mode: true, text: 'On'};

    $scope.toggleAutoSave = function() {
      if ($scope.autosave.mode) {
        $scope.autosave.text = 'On';
      } else {
        $scope.autosave.text = 'Off';
      }
    };

    // watch challenge object
    $scope.$watch('challenge', function(newChallenge, oldChallenge) {
      // console.log('challenge changed: new: ', newChallenge);
      // challenge is changed, start autosave timer if autosave is on
      if ($scope.autosave.mode && newChallenge) {
        if (isChallengeDirty(newChallenge) && isChallengeChanged(newChallenge, oldChallenge)) {
          startAutoSaveTimer();
        }
      }
    }, true);

    $scope.checkNew = function() {
      if ($stateParams.challengeId) {
        $scope.findOne();
      } else {
        $scope.clearAlerts();
        $scope.challenge = new Challenges({title: 'untitled challenge'});
      }
    };

    $scope.cancelChallenge = function() {
      $scope.challenge = null;
      $location.path('challenges');
    };

    // this method is not used any more
    $scope.create = function(isValid) {
      if (isValid) {
        var challenge = new Challenges({
          title: this.title,
          regStartDate: this.regStartDate,
          subEndDate: this.subEndDate,
          summary: this.summary,
          description: this.description,
          registeredDescription: this.registeredDescription,
          type: this.type
        });

        getTagsFromTagList(challenge);

        challenge.$save(function(response) {
          $location.path('challenges/' + response.id);
        });

        this.title = '';
        this.regStartDate = '';
        this.subEndDate = '';
        this.summary = '';
        this.description = '';
        this.registeredDescription = '';
        this.type = 'Architecture';
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

    // used for both create and update
    $scope.update = function(isValid) {
      if (isValid) {
        var challenge = $scope.challenge;

        getTagsFromTagList(challenge);

        if (challenge.id) {   // update
          challenge.$update(function() {
            $location.path('challenges/' + challenge.id);
          });
        } else {              // create
          challenge.$save(function(response) {
            $location.path('challenges/' + response.id + '/edit');
          });
        }
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      $scope.challenge = null;
      $scope.clearAlerts();
      Challenges.query(function(challenges) {
        $scope.challenges = challenges;
      });
    };

    $scope.findOne = function() {
      Challenges.get({
        challengeId: $stateParams.challengeId
      }, function(challenge) {
        populateTagListFromTags(challenge);
        $scope.challenge = challenge;
      });
    };

    $scope.renderHtml = function(html) {
      return $sce.trustAsHtml(html);
    };

    $scope.selectItem = function(selectedItem) {
      angular.forEach($scope.challenges, function(item) {
        item.selected = false;
        if (selectedItem === item) {
          $scope.selected = item;
          selectedItem.selected = true;
        }
      });
    };


    // scope helper methods

    function getTagsFromTagList(challenge) {
        if (challenge.tagList) {
          challenge.tags = [];
          var tags = challenge.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }
    }

    function populateTagListFromTags(challenge) {
      if (challenge.tags) {
        challenge.tagList = challenge.tags.join(',');
      }
    }

    function isChallengeChanged(newChallenge, oldChallenge) {
      return !angular.equals(newChallenge, oldChallenge);
    }

    function isChallengeDirty(challenge) {
      if ($scope.challengeForm) {     // only new or edit page
        for (var prop in challenge) {
          // ignore any title change or only new challenge title
          if ($scope.challengeForm[prop] && prop !== 'title' && $scope.challengeForm[prop].$dirty) {
            return true;
          }
        }
        clearChallengeDirty();
      }
      return false;
    }

    function clearChallengeDirty() {
      if ($scope.challengeForm) {
        $scope.challengeForm.$setPristine();
      }
    }

    function startAutoSaveTimer() {
      // cancel the existing one if it's running
      if ($scope.autosave.timer) {
        $timeout.cancel($scope.autosave.timer);
      }
      // console.log('started autosave timeout: ');
      $scope.autosave.timer = $timeout(autoSaveChallenge, $scope.config.autosaveGracePeriod*1000);
    }

    function autoSaveChallenge() {
      // save either new or existing challenge
      if ($scope.challenge && isChallengeDirty($scope.challenge)) {

        // clear dirty
        clearChallengeDirty();

        var challenge = $scope.challenge;
        getTagsFromTagList(challenge);

        // display update start message
        $scope.addAlert('info', 'Saving challenge ...');

        if (challenge.id) {   // update
          challenge.$update(function(response) {
            populateTagListFromTags(challenge);

            // display update success message
            $scope.addAlert('success', 'Challenge is saved!');
          }, function(err) {
            // display update fail message
            $scope.addAlert('warning', 'Failed to save challenge!');
          });
        } else {      // create
          challenge.$save(function(response) {
            $scope.addAlert('success', 'Challenge is saved!');
            // go to edit page
            $location.path('challenges/' + response.id + '/edit');
          }, function(err) {
            $scope.addAlert('warning', 'Failed to save challenge!');
          });
        }
      }
    }

  }
]);
