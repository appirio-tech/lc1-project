'use strict';
/**
 * FileSelect direvice.
 * This will set the model value to file
 */

angular.module('mean.challenges').directive('fileSelect', function() {
  return {
    restrict : 'A',
    scope : {
      fileSelect : '='
    },
    link : function($scope, $element, attrs) {
      $element.bind('change', function(changeEvent) {
        $scope.fileSelect = $element[0].files[0];
        $scope.$apply();
      });
    }
  };
});