/**
 * CODE REFACTORED
 * File service moved to separate file.
 */

'use strict';

/**
 * Factory initialization for FileService
 */
angular.module('mean.challenges').factory('FileService', [ '$http', function($http) {
  var FileService = {};
  /**
   * File upload method
   * @param  {Object}         data            form data with title as field and file as file
   * @param {Object}          url             File upload url
   * @param  {Function}       callback        Callback function
   */
  FileService.upload = function(url, data, callback) {
    $http({
      method : 'POST',
      url : url,
      data : data,
      headers: {'Content-Type': undefined },
      transformRequest : angular.identity
    }).success(function(data, status) {
      callback(data, status);
    }).error(function(data, status) {
      callback(data, status);
    });
  };

  /**
   * Fetches all files list from server
   * @param {Object}          url             Files GET URL
   * @param  {Function}       callback        Callback function
   */
  FileService.getAll = function(url, callback) {
    $http({method: 'GET', url : url}).success(function(data, status) {
      callback(data, status);
    }).error(function(data, status) {
      callback(data, status);
    });
  };

  /**
   * Deletes the file resource represents by the unique URI
   * @param  {String}         uri             URI
   * @param  {Function}       callback        callback function
   */
  FileService.deleteFile = function(url, callback) {
    $http({method: 'DELETE', url : url}).success(function(data, status) {
      callback(data, status);
    }).error(function(data, status) {
      callback(data, status);
    });
  };

  return FileService;
}]);