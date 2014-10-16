/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';



angular.module('mean.challenges')
/**
 * The directive to display discussion and messages.
 *   Input parameters:
 *     - remoteObjectName: the name of remote object, provided from remote-object-name attribute value.
 *     - remoteObjectId: the id of remote object, provided from remote-object-id attribute value.
 *     - url: the url of discussions service endpoint, ex) http://lc1-discussion-service.herokuapp.com/discussions,
 *            provided from the parent scope.
 */
.directive('tcDiscussion', ['$http', function ($http) {

  return {
    restrict: 'E',
    scope: {
      remoteObjectName: '@',
      remoteObjectId: '@'
    },
    controller: function($scope) {
      // user avatar images are hardcoded for now
      $scope.images = [
        'http://res.cloudinary.com/peakpado/image/upload/v1413254950/user1_p0czzr.png',
        'http://res.cloudinary.com/peakpado/image/upload/v1413254957/user2_lviuqk.png',
        'http://res.cloudinary.com/peakpado/image/upload/v1383031335/bee_a7su6g.png'
      ];

      // get the discussin URL  // will use this later
      $http.get('/discussionUrl').success(function(result) {
        var discussionUrl = result.discussionUrl;

        // hardcoded discussionId for now as stated in the challenge requirement
        //var discussionId = 15;  // not used now.

        if (discussionUrl.charAt(discussionUrl.length-1) !== '/') {
          discussionUrl = discussionUrl+ '/';
        }

        //var messagesUrl = discussionUrl+discussionId+'/messages';

        // ktb hack to get some messages via hardcoded but actual message url in the server controller


        $scope.messages = [];
        //$http.get(messagesUrl).success(function(result) {
        $http.get('/testmessages').success(function(result) {
          //$scope.messages = result.messages;   // changed payload
          $scope.messages = result.content;
          //console.log(' the result is ' + JSON.stringify(result.content,undefined,2) );
          // sort messages by createdAt
          $scope.messages.sort(function(a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          });
        })
        .error(function(err) {
          console.log('tc-discussion: get messages had err: ', err);
        });

      })
      .error(function(err) {
        console.log('tc-discussion: error to get discussionUrl: ', err);
      });

      $scope.addComment = function() {
        console.log('addComment is clicked, comment: ', $scope.comment);
      };
    },
    templateUrl: 'challenges/views/directives/discussion-template.html'
  };
}]);
