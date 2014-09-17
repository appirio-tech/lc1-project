'use strict';

angular.module('mean.info').controller('InfoController', ['$scope', 'Global', 'Info', '$log', '$http',
  function($scope, Global, Info, $log, $http) {
    $scope.global = Global;
    $scope.package = {
      name: 'info'
    };


    $scope.loadIssues = function() {
      // show more or less issues
      var limitStep = 5;

        $scope.openlimit = limitStep;
        $scope.incrementOpenLimit = function() {
            $scope.openlimit += limitStep;
        };
        $scope.decrementOpenLimit = function() {
            $scope.openlimit -= limitStep;
        };
        //closed
        $scope.closedlimit = limitStep;
        $scope.incrementClosedLimit = function() {
            $scope.closedlimit += limitStep;
        };
        $scope.decrementClosedLimit = function() {
            $scope.closedlimit -= limitStep;
        };



      $log.log('getting the issues');
      $http.get('/issues').then(function(result) {
        $scope.issues = result.data;
      });
    };







  }
]);
