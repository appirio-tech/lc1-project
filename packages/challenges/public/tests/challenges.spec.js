'use strict';

(function() {
  // Challenges Controller Spec
  describe('MEAN controllers', function() {
    describe('ChallengesController', function() {
      // The $resource service augments the response object with methods for updating and deleting the resource.
      // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
      // the responses exactly. To solve the problem, we use a newly-defined toEqualData Jasmine matcher.
      // When the toEqualData matcher compares two objects, it takes only object properties into
      // account and ignores methods.
      beforeEach(function() {
        this.addMatchers({
          toEqualData: function(expected) {
            return angular.equals(this.actual, expected);
          }
        });
      });

      beforeEach(function() {
        module('mean');
        module('mean.system');
        module('mean.challenges');
      });

      // Initialize the controller and a mock scope
      var ChallengesController,
        scope,
        $httpBackend,
        $stateParams,
        $location;

      // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
      // This allows us to inject a service but then attach it to a variable
      // with the same name as the service.
      beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {

        scope = $rootScope.$new();

        ChallengesController = $controller('ChallengesController', {
          $scope: scope
        });

        $stateParams = _$stateParams_;
        $httpBackend = _$httpBackend_;
        $location = _$location_;

      }));

      it('$scope.find() should create an array with at least one challenge object ' +
        'fetched from XHR', function() {

          // test expected GET request
          $httpBackend.expectGET('challenges').respond([{
            title: 'An Challenge about MEAN',
            description: 'MEAN rocks!',
            regStartDate: '2014-08-13T00:00:00.000Z'
          }]);

          // run controller
          scope.find();
          $httpBackend.flush();

          // test scope value
          expect(scope.challenges).toEqualData([{
            title: 'An Challenge about MEAN',
            description: 'MEAN rocks!',
            regStartDate: '2014-08-13T00:00:00.000Z'
          }]);

        });

      it('$scope.findOne() should create an array with one challenge object fetched ' +
        'from XHR using a challengeId URL parameter', function() {
          // fixture URL parament
          $stateParams.challengeId = 5;

          // fixture response object
          var testChallengeData = function() {
            return {
              title: 'An Challenge about MEAN',
              description: 'MEAN rocks!',
              regStartDate: '2014-08-13T00:00:00.000Z'
            };
          };

          // test expected GET request with response object
          $httpBackend.expectGET(/challenges\/([0-9])$/).respond(testChallengeData());

          // run controller
          scope.findOne();
          $httpBackend.flush();

          // test scope value
          expect(scope.challenge).toEqualData(testChallengeData());

        });

      it('$scope.create() with valid form data should send a POST request ' +
        'with the form input values and then ' +
        'locate to new object URL', function() {

          // fixture expected POST data
          var postChallengeData = function() {
            return {
              title: 'An Challenge about MEAN',
              description: 'MEAN rocks!',
              regStartDate: '2014-08-13T00:00:00.000Z'
            };
          };

          // fixture expected response data
          var responseChallengeData = function() {
            return {
              id: 5,
              title: 'An Challenge about MEAN',
              description: 'MEAN rocks!',
              regStartDate: '2014-08-13T00:00:00.000Z'
            };
          };

          // fixture mock form input values
          scope.title = 'An Challenge about MEAN';
          scope.description = 'MEAN rocks!';
          scope.regStartDate = '2014-08-13T00:00:00.000Z';

          // test post request is sent
          $httpBackend.expectPOST('challenges', postChallengeData()).respond(responseChallengeData());

          // Run controller
          scope.create(true);
          $httpBackend.flush();

          // test form input(s) are reset
          expect(scope.title).toEqual('');
          expect(scope.description).toEqual('');
          expect(scope.regStartDate).toEqual('');

          // test URL location to new object
          expect($location.path()).toBe('/challenges/' + responseChallengeData().id);
        });

      it('$scope.update(true) should update a valid challenge', inject(function(Challenges) {

        // fixture rideshare
        var putChallengeData = function() {
          return {
            id: 5,
            title: 'An Challenge about MEAN',
            description: 'MEAN is great!',
            regStartDate: '2014-08-13T00:00:00.000Z'
          };
        };

        // mock challenge object from form
        var challenge = new Challenges(putChallengeData());

        // mock challenge in scope
        scope.challenge = challenge;

        // test PUT happens correctly
        $httpBackend.expectPUT(/challenges\/([0-9])$/).respond();

        // run controller
        scope.update(true);
        $httpBackend.flush();

        // test URL location to new object
        expect($location.path()).toBe('/challenges/' + putChallengeData().id);

      }));

      it('$scope.remove() should send a DELETE request with a valid challengeId ' +
        'and remove the challenge from the scope', inject(function(Challenges) {

          // fixture rideshare
          var challenge = new Challenges({
            id: 5
          });

          // mock rideshares in scope
          scope.challenges = [];
          scope.challenges.push(challenge);

          // test expected rideshare DELETE request
          $httpBackend.expectDELETE(/challenges\/([0-9])$/).respond(204);

          // run controller
          scope.remove(challenge);
          $httpBackend.flush();

          expect(scope.challenges.length).toBe(0);

        }));
    });
  });
}());
