/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

//grid dynamic style used for challenges list.
angular.module('mean.challenges')
  .directive('challengeGrid', function($window){
    return function (scope, element) {

      var w = angular.element($window);
      scope.$watch(function () {
        return {'h': w.height(), 'w': w.width()};
      }, function (newValue, oldValue) {
        scope.windowHeight = newValue.h;
        scope.windowWidth = newValue.w;

        // update the grid's style. You can modify the values here.
        scope.style = function () {
          return {
            'height': (newValue.h - 100) + 'px',
            'width': '100%'
          };
        };

      }, true);

      w.bind('resize', function () {
        scope.$apply();
      });
    };
  });