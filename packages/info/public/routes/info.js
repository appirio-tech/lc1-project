'use strict';

angular.module('mean.info').config(['$stateProvider',
  function($stateProvider) {
    $stateProvider.state('info page', {
      url: '/info/example',
      templateUrl: 'info/views/index.html'
    });
  }
]);
