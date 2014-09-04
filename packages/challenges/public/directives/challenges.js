/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges').directive('registerButton', function($location, $resource){
  return {
    template: '<button class="btn" ng-click="registerChallenge(challenge)" ng-show="infoLoaded&&!registered">Register</button>',
    restrict: 'EA',
    scope: {
      challenge: '=challenge'
    },
    link: function(scope){
      var ChallengeRegistrants = $resource('challenges/:challengeId/register', {
          challengeId: '@id'
        }, {
          register: {
            method: 'POST'
          }
        }
      );
      scope.registerChallenge = function(challenge){
        $location.path('challenges/'+ challenge.id + '/register');
      };

      // get registrants info
      scope.registered = false;
      scope.infoLoaded = false;
      scope.$watch('challenge', function(challenge){
        if ( !challenge ) return;
        ChallengeRegistrants.query({challengeId: scope.challenge.id}, function(registrants){
          angular.forEach(registrants, function(item){
            if(item.userId === window.user._id)
              scope.registered = true;
          });
          scope.infoLoaded = true;
        });
      }, true);
    }
  };
})
  .directive('registerOperation', function($location, $resource){
    return{
      template:
      '<div class="btn-group">' +
        '<button class="btn btn-default" ng-click="register(challenge)" ng-disabled="!infoLoaded">Register</button>' +
        '<button class="btn btn-primary" ng-click="cancelRegister(challenge)">Cancel</button>' +
      '</div>',
      restrict: 'EA',
      scope: {
        challenge: '=challenge'
      },
      link: function(scope){
        var ChallengeRegistrants = $resource('challenges/:challengeId/register', {
            challengeId: '@id'
          }, {
            register: {
              method: 'POST'
            }
          }
        );

        scope.$watch('challenge', function(challenge){
          if ( !challenge ) return;
          else scope.infoLoaded = true;
        }, true);

        scope.register = function(challenge) {
          ChallengeRegistrants.register({id: challenge.id}, function(data){
            $location.path('challenges/' + challenge.id);
          });
        };
        scope.cancelRegister = function(challenge) {
          $location.path('challenges/' + challenge.id);
        };
      }
    };
  });
