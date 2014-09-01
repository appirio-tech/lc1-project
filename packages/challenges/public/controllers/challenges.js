/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges', ['ngGrid']).controller('ChallengesController', ['$scope', '$stateParams', '$location', '$sce', 'Global', 'Challenges',
  function($scope, $stateParams, $location, $sce, Global, Challenges) {
    $scope.global = Global;

    $scope.checkNew = function() {
      if ($stateParams.challengeId) {
        $scope.findOne();
      } else {

        var prizes =
        { prizesArray:
          [
            {
              index: 0,
              place: 1,
              amount: 50,
              points: 50,
              deleted: false
            },
            {
              index: 1,
              place: 2,
              amount: 0,
              points: 0,
              deleted: false
            }
          ],
          prizesSum: 50
        };

        var challenge = new Challenges({
          title: 'Untitled Challenge',
          type: 'Architecture',
          prizes: JSON.stringify(prizes)
        });

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
      }else{
          $location.path('challenges');
      }
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var challenge = new Challenges({
          title: this.title,
          regStartDate: this.regStartDate,
          subEndDate: this.subEndDate,
          summary: this.overview,
          description: this.description,
          registeredDescription: this.registeredDescription,
          type: this.type
        });

        if (this.tagList) {
          challenge.tags = [];
          var tags = this.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }

        challenge.$save(function(response) {
          $location.path('challenges/' + response.id);
        });

        this.title = '';
        this.regStartDate = '';
        this.subEndDate = '';
        this.overview = '';
        this.description = '';
        this.registeredDescription = '';
        this.type = 'Architecture';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(challenge) {
      if (challenge) {
        challenge.$remove();

        for (var i in $scope.challenges) {
          if ($scope.challenges[i] === challenge) {
            $scope.challenges.splice(i, 1);
          }
        }
      } else {
        $scope.challenge.$remove(function(response) {
          $location.path('challenges');
        });
      }
    };

    $scope.update = function(isValid, challengeForm) {

      // if current prize object is invalid, prevent user from updating a challenge.
      if(!$scope.allPrizeValid)
        return;

      Challenges.newChallengeId = null;
      if (isValid) {
        var challenge = $scope.challenge;
        challenge.title = challenge.title.trim();

        if (challenge.tagList) {
          challenge.tags = [];
          var tags = challenge.tagList.split(',');
          for (var i = 0; i < tags.length; i += 1) {
            challenge.tags.push(tags[i].trim());
          }
        }

        // if prizes exist, convert its type.
        if (challenge.prizes) {
          angular.forEach($scope.prizeData, function(displayPrize){
            angular.forEach(challenge.prizes.prizesArray, function(storePrize){
              if(displayPrize.index === storePrize.index){
                storePrize.amount = displayPrize.amount;
                storePrize.place = displayPrize.place;
                storePrize.points = displayPrize.points;
              }
            });
          });
          challenge.prizes.prizesSum = $scope.totalAmount;
        }

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
      Challenges.get({
        challengeId: $stateParams.challengeId
      }, function(challenge) {
        window.ch = challenge;

        if (challenge.tags) {
          challenge.tagList = challenge.tags.join(',');
        }

        $scope.challenge = challenge;
        $scope.parsePrize($scope.challenge.prizes.prizesArray);
      });
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

    /** challenge Prizes logic begin **/
    // grid data store
    $scope.prizeData = [];
    $scope.totalAmount = 0;
    function updatePlaceName(item){
      if( 3<item.place && item.place<21) {
        item.placeDisplay = item.place + ' th';
      } else if( item.place%10 === 1){
        item.placeDisplay = item.place + ' st';
      } else if( item.place%10 === 2){
        item.placeDisplay = item.place + ' nd';
      } else if( item.place%10 === 3){
        item.placeDisplay = item.place + ' rd';
      } else{
        item.placeDisplay = item.place + ' th';
      }
    }

    // filter the data into grid data store, if the prize's status is deleted, this function will drop it.
    $scope.parsePrize = function(prizesData){
      var temp = angular.copy(prizesData);
      angular.forEach(temp, function(item){
        if(!item.deleted){
          updatePlaceName(item);
          $scope.prizeData.push(angular.copy(item));
          $scope.totalAmount += item.amount;
        }
      });
    };

    //Adjust the gird height based on the number of prizes.
    $scope.$watch(
      function(){
        return $scope.prizeData.length;
      },
      function(newValue){
        $scope.prizesGridStyle = function(){
          return{
            'height' : (30 * newValue + 35) + 'px',
            'width' : '100%'
          };
        };
      },
      true
    );

    $scope.deletePrizes = function(index){
      //mark the prize deleted in challenge.prizes.prizesArray data store.
      angular.forEach($scope.challenge.prizes.prizesArray, function(item){
        if(item.index===index)
          item.deleted = true;
      });

      // drop it form current grid's data store
      var position=0;
      for(var i=0; i<$scope.prizeData.length; i+=1){
        if($scope.prizeData[i].index===index){
          position = i;
          $scope.totalAmount -= $scope.prizeData[i].amount;
        }
      }
      $scope.prizeData.splice(position, 1);

      // reorder current grid's data array and update their place and placeDisplay values.
      position = 1;
      angular.forEach($scope.prizeData, function(item){
        item.place = position;
        position += 1;
        updatePlaceName(item);
      });
    };
    $scope.addNewPrize = function(){
      // initialize new prize object.
      var newPrize = {
        index: $scope.challenge.prizes.prizesArray.length,
        place: $scope.prizeData.length+1,
        amount: 0,
        points: 0,
        deleted: false
      };
      $scope.challenge.prizes.prizesArray.push(angular.copy(newPrize));
      updatePlaceName(newPrize);
      $scope.prizeData.push(newPrize);
    };

    $scope.allPrizeValid = true;
    $scope.$watch(
      function(){
        return $scope.prizeData;
      },
      function(updatedPrizeData){
        $scope.allPrizeValid = true;
        $scope.totalAmount = 0;
        angular.forEach(updatedPrizeData, function(prize){
          if(prize.amount===undefined || prize.amount===null || prize.amount<0){
            //you can default the invalid amount to 0 here.
            prize.amountError = true;
            $scope.allPrizeValid = false;
          }else{
            prize.amountError = false;
            $scope.totalAmount += prize.amount;
          }
          if(prize.points===undefined || prize.points===null || prize.points<0){
            //you can default the invalid points to 0 here.
            prize.pointsError = true;
            $scope.allPrizeValid = false;
          }else{
            prize.pointsError = false;
          }
        });
      },
      true
    );
    $scope.prizesGridOptions = {
      data: 'prizeData',
      enableCellSelection: true,
      enableRowSelection: false,
      columnDefs: [
        {
          field: 'index',
          displayName: '',
          cellTemplate:
            '<span>' +
              '<a class="btn" ng-click="deletePrizes(row.getProperty(col.field))">' +
                '<i class="glyphicon glyphicon-trash"></i>' +
              '</a>' +
            '</span>'
        },
        {
          field: 'placeDisplay',
          displayName: 'Place'
        },
        {
          field: 'amount',
          displayName: 'Amount',
          enableCellEdit: true,
          cellTemplate: '<div class="ngCellText" ng-class="{prizeWarningCell: row.getProperty(\'amountError\')}"><span>$ {{row.getProperty(col.field)}}</span></div>',
          editableCellTemplate: '<div class="ngCellText"><span>$ </span><input style="width:80%; height:22px; display:inline;" ng-model="COL_FIELD" ng-input="COL_FIELD" type="number"/></div>'
        },
        {
          field: 'points',
          displayName: 'Points',
          enableCellEdit: true,
          cellTemplate: '<div class="ngCellText" ng-class="{prizeWarningCell: row.getProperty(\'pointsError\')}"><span>{{row.getProperty(col.field)}}</span></div>',
          editableCellTemplate: '<div class="ngCellText"><input style="width:90%; height:22px; display:inline;" ng-model="COL_FIELD" ng-input="COL_FIELD" type="number"/></div>'
        }
      ]
    };
  }
]);
