/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges').controller('ChallengesController', 
    ['$scope', '$http', '$stateParams', '$location', '$sce', '$modal', 'Global', 'Challenges', 'ChallengeLaunch', 'ChallengeRequirements', 'ChallengeRegistrants',
  function($scope, $http, $stateParams, $location, $sce, $modal, Global, Challenges, ChallengeLaunch, ChallengeRequirements, ChallengeRegistrants) {
    $scope.global = Global;

    $scope.checkNew = function() {
      if ($stateParams.challengeId) {
        $scope.findOne();
      } else {
        var challenge = new Challenges({
          title: 'Untitled Challenge',
          type: 'Architecture'
        });

        //FIXME This creates an empty challenge whenever Create New Challenge link is clicked.
        // I fixed it in the autosave submission.
        challenge.$save(function(response) {
          Challenges.newChallengeId = response.id;
          $location.path('challenges/' + response.id + '/edit');
        });
      }
    };

    $scope.cancelChallenge = function(challenge) {
      if (Challenges.newChallengeId!==undefined && challenge.id === Challenges.newChallengeId) {
        challenge.$remove(null,function(){
          $scope.newChallengeId = null;
          $location.path('challenges');
        });
      } else {
          $location.path('challenges');
      }
    };

    var ChallengeLaunchModalController = function($scope, $modalInstance, error) {
      $scope.error = error;
      $scope.ok = function() {
        $modalInstance.close();
      };
    };

    $scope.launch = function(challenge) {
      ChallengeLaunch.launch({id: challenge.id}, function(data) {
        if (!data.error) {
          challenge.status = 'started';
        }
        $modal.open({
          templateUrl: 'challenges/views/modallaunch.html',
          controller: ChallengeLaunchModalController,
          resolve: {
            error: function() { return data.error; }
          }
        });
      }); 
    };

    // $scope.create = function(isValid) {
    //   if (isValid) {
    //     var challenge = new Challenges({
    //       title: this.title,
    //       regStartDate: this.regStartDate,
    //       subEndDate: this.subEndDate,
    //       summary: this.overview,
    //       description: this.description,
    //       registeredDescription: this.registeredDescription,
    //       type: this.type
    //     });

    //     if (this.tagList) {
    //       challenge.tags = [];
    //       var tags = this.tagList.split(',');
    //       for (var i = 0; i < tags.length; i += 1) {
    //         challenge.tags.push(tags[i].trim());
    //       }
    //     }

    //     challenge.$save(function(response) {
    //       $location.path('challenges/' + response.id);
    //     });

    //     this.title = '';
    //     this.regStartDate = '';
    //     this.subEndDate = '';
    //     this.overview = '';
    //     this.description = '';
    //     this.registeredDescription = '';
    //     this.type = 'Architecture';
    //   } else {
    //     $scope.submitted = true;
    //   }
    // };

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

    $scope.update = function(isValid, challengeForm) {
      Challenges.newChallengeId = null;
      if (isValid) {
        var challenge = $scope.challenge;
        challenge.title = challenge.title.trim();

        if (challenge.tagList) {
          challenge.tags = [];
          var tags = challenge.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }

        challenge.$update(function() {
          $location.path('challenges/' + challenge.id);
        }, function(){
          challengeForm.title.$error.required = true;
          challengeForm.title.$invalid = true;
          $scope.submitted = true;
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
      $scope.requirements = [];
      $scope.showReqForm = false;

      Challenges.get({
        challengeId: $stateParams.challengeId
      }, function(challenge) {
        if (challenge.tags) {
          challenge.tagList = challenge.tags.join(',');
        }
        $scope.challenge = challenge;

        // get challenge requirements
        ChallengeRequirements.query({challengeId: challenge.id}, function(requirements){
          $scope.requirements = requirements;
        });

        // get registrants info
        $scope.registered = false;
        $scope.infoLoaded = false;
        ChallengeRegistrants.query({challengeId: challenge.id}, function(registrants){
          angular.forEach(registrants, function(item){
            if(item.userId === window.user._id)
              $scope.registered = true;
          });
          $scope.infoLoaded = true;
        });
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


    /*
     * methods for challenge requirement
     */

    $http.get('/requirementTypes').success(function(response) {
      $scope.reqTypes = response;
    })
    .error(function(err){
      console.log('err on getting requirement types: ', err);
    });

    $http.get('/requirementNeccesities').success(function(response) {
      $scope.reqNeccesities = response;
    })
    .error(function(err){
      console.log('err on getting requirement neccesities: ', err);
    });

    $scope.addRequirement = function() {
      $scope.showReqForm = true;
      $scope.requirement = new ChallengeRequirements();
      $scope.requirement.type = $scope.reqTypes[0];
    };

    $scope.createRequirement = function(isValid, requirementForm) {
      if (isValid) {
        var challenge = $scope.challenge;
        var requirement = $scope.requirement;
        requirement.body = requirement.body.trim();

        if (requirement.tagList) {
          requirement.tags = [];
          var tags = requirement.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            requirement.tags.push(tags[i].trim());
          }
        }

        requirement.$save({challengeId: challenge.id}, function(response) {
          console.log('saved req: ', response);
          $scope.showReqForm = false;
          $scope.requirements.unshift(response);
        }, function(err){
          console.log('req save err: ', err);
          //TODO display error message
          $scope.submitted = true;
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.cancelRequirement = function(challenge) {
      $scope.showReqForm = false;
      $scope.requirement = null;
    };

    $scope.registerChallenge = function(challenge) {
      $location.path('challenges/'+ challenge.id+ '/register');
    };
    $scope.register = function(challenge) {
      ChallengeRegistrants.register({id: challenge.id}, function(data){
        $location.path('challenges/' + challenge.id);
      });
    };
    $scope.cancelRegister = function(challenge) {
      $location.path('challenges/' + challenge.id);
    };
  }
]);
