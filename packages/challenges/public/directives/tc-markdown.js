/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';


/**
 * The directive that renders the content data as html or markdown based on
 * content.type. The code was inspired by these references:
 *
 *  - http://blog.angularjs.org/2012/05/custom-components-part-1.html
 *  - https://github.com/btford/angular-markdown-directive
 */
angular.module('mean.challenges')
.directive('tcMarkdown', ['$sanitize', function ($sanitize) {
  var markdownConverter = new window.Showdown.converter();
  return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (attrs.tcMarkdown) {
          scope.$watch(attrs.tcMarkdown, function (newVal) {
            if (newVal) {
              var html = $sanitize(markdownConverter.makeHtml(newVal));
              element.html(html);
            } else {
              element.html('--empty--');
            }
          });
        } else {
          console.log('tcMarkdown attribute is not set');
        }
      }
  };
}])
;
