/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

/**
 * FileService is added as a dependency
 */

angular.module('mean.challenges').controller('ChallengesController', ['$scope', '$stateParams', '$location', '$sce', 'Global', 'Challenges','FileService','$window','$timeout','$http','ChallengeRequirements', 'ChallengeLaunch', 'Tags', '$modal', '$log', '$q',
  function($scope, $stateParams, $location, $sce, Global, Challenges, FileService, $window, $timeout, $http, ChallengeRequirements, ChallengeLaunch, Tags, $modal, $log, $q) {
    $scope.global = Global;

    $scope.checkNew = function() {
      if ($stateParams.challengeId) {
        $scope.findOne();
      } else {
        var challenge = new Challenges({
          title: 'Untitled Challenge',
          type: 'Architecture',
          createdBy:  $scope.global.user.username
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

    $scope.remove = function(challenge) {
      if (challenge) {
        challenge.$remove();
        $log.log('removed called');
        // $location.path('challenges');  // this happense too soon, the splice has not completed

        for (var i in $scope.challenges) {
          if ($scope.challenges[i] === challenge) {
            $scope.challenges.splice(i, 1);
          }
        }


      } else {
        $scope.challenge.$remove(function(response) {
          $location.path('challenges');
          $log.log('remove response returned');
        });
      }
      //FIXME  The response never comes so we never reload the list view
      // I call it here anyway but the deleted record will still show up.
      $location.path('challenges'); // try here maybe ready now
    };

    $scope.update = function(isValid, challengeForm) {
      Challenges.newChallengeId = null;
      if (isValid) {
        var challenge = $scope.challenge;
        challenge.title = challenge.title.trim();
        // swamp to the accountId ktb
        challenge.accountId = $scope.selectedAccountId;
        //  add the user
        challenge.updatedBy = $scope.global.user.username;

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
        $scope.challenge = challenge;
        angular.forEach(challenge.tags, function(tag){

          // need to put the tags of challenge into tag list, otherwise, the tag of challenge
          // will not be displayed in tag list option.
          if ($scope.allTags.indexOf(tag) < 0) {
            $scope.allTags.push(tag);
          }
        });

        // get challenge requirements
        ChallengeRequirements.query({challengeId: challenge.id}, function(requirements){
          $scope.requirements = requirements;
        });

      });
      /**
       * Loading this challenge files
       */
      loadFiles();
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
      console.log('Error on getting requirement types: ', err);
    });

    $http.get('/requirementNecessities').success(function(response) {
      $scope.reqNecessities = response;
    })
    .error(function(err){
      console.log('Error on getting requirement necessities: ', err);
    });

    $scope.addRequirement = function() {
      $scope.showReqForm = true;
      $scope.requirement = new ChallengeRequirements();
      $scope.requirement.type = $scope.reqTypes[0];  // sets the default type to functional
      $scope.requirement.score_min = 0;  //sets default value to 0
      $scope.requirement.score_max = 4;  //sets default value to 4
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

    /**
     * BASE PATH
     * @type {String}
     */
    var BASE_PATH = '/challenges';
	  /**
     * HTTP OK STATUS CODE
     */
    var HTTP_OK = 200;

    /**
     * Reset upload form
     */
    var resetUploadForm = function() {
      /**
       * Resetting uploaded file
       * @type {Object}
       */
      $scope.uploadSuccess = false;
      $scope.showUploadProgressBar = false;
      $scope.invalidFile = false;
      $scope.uploadError = false;
      $scope.uploadErrorData = undefined;
    };
    /**
     * Upload file controller method
     * @param  {Object}       upload         Upload model
     * @param  {Boolean}      isValid        isValid TRUE if uploadForm is valid
     */
    $scope.uploadFile = function(upload, isValid) {
      if(isValid) {
        if(angular.isUndefined(upload.file)) {
          $scope.invalidFile = true;
          return;
        }
        /**
         * Form is valid process file upload
         */
        // show the progress bar here
        $scope.showUploadProgressBar = true;
        // upload url
        var url = BASE_PATH + '/' + $stateParams.challengeId + '/upload';
        // form data
        var data = new FormData();
        data.append('title', upload.title);
        data.append('file', upload.file);
        FileService.upload(url, data, function(data, status) {
          if(status===HTTP_OK) {
            $scope.uploadSuccess = true;
            $scope.showUploadProgressBar = false;
          } else {
            $scope.uploadError = true;
            $scope.uploadErrorData = data;
          }
          $timeout(resetUploadForm, 3000, true);
        });
      }
    };

    /**
     * Call reset uploadform
     */
    resetUploadForm();

    /**
     * Model for all files. In view UI this list is shown
     * @type {Array}
     */
    $scope.allFiles = [];

    /**
     * Local function. This is called form findOne() during ng-init.
     * It will fetch list of files from a REST endpoint
     */
    var loadFiles = function() {
      $scope.loadingFiles = true;
      // load Files url
      var url = BASE_PATH + '/' + $stateParams.challengeId + '/files';
      FileService.getAll(url, function(data, status) {
        if(status === HTTP_OK) {
          $scope.allFiles = data;
        } else {
          $scope.loadError = true;
        }
        $scope.loadingFiles = false;
      });
    };

    /**
     * Controller function to delete file
     * @param  {Number}         fileId      Id of the file to delete
     */
    $scope.deleteFile = function(fileId) {
      // delete resource URL
      var url = BASE_PATH + '/files' + '/' + fileId;
      FileService.deleteFile(url, function(data, status) {
        if(status===HTTP_OK) {
          $window.location.reload();
        } else {
          $scope.loadError = true;
          $scope.deleteError = data;
        }
      });
    };

    // get all tags
    $scope.allTags = [];
    var getAllTags = function() {
      // clear if exist
      $scope.allTags = [];
      Tags.query(function(tags) {
        angular.forEach(tags, function(tag){
          $scope.allTags.push(tag.name);
        });
      });
    };
    getAllTags();

    // helper to set the accountid instead
    $scope.selected = '';

    $scope.setAccountId = function(item){
      $scope.selectedAccountId = item.accountId;
    };

    // query account based on the query string.
    $scope.getAccounts = function(query) {
      // to improve performance, will query when user input more than 1 char.
      if (query.length < 2) {
        var deferred = $q.defer();
        deferred.resolve([]);
        // For typeahead of ui-bootstrap, should return a promise, which is resolved as an array.
        return deferred.promise;
      }
      return $http.get('/accounts/' + query).then(function(result) {
        return result.data;
      });
    };

      /*
     * code changes for just markdown
     */

    // Initially preview is off, which is Edit mode.
    $scope.preview = false;   // Edit mode
    $scope.previewButtonText = 'Preview';
    $scope.togglePreviewEdit = function() {
      console.log('togglePreviewEdit: ', $scope.preview);
      $scope.preview = ! $scope.preview;
      if ($scope.preview) {
        $scope.previewButtonText = 'Edit';
      } else {
        $scope.previewButtonText = 'Preview';
      }
    };

      $scope.showMarkdownHelp = function() {
      console.log('markdownHelp: ');
      $modal.open({
        templateUrl: 'markdownHelpModal.html',
        controller: 'MarkdownHelpModalController',
        size: 'sm'
      });
    };

  }
])


// markdown help modal controller
.controller('MarkdownHelpModalController', ['$scope', '$modalInstance', function($scope, $modalInstance) {

    $scope.close = function () {
      $modalInstance.close();
    };
}]) ;
