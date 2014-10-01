/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges').controller('ListChallengesController', ['$scope', '$stateParams', '$location', '$sce', 'Global', 'Challenges',
    function($scope, $stateParams, $location, $sce, Global, Challenges) {
        $scope.global = Global;

        $scope.remove = function(challenge) {
            if (challenge) {
                challenge.$remove();

                for (var i in $scope.challenges) {
                    if ($scope.challenges[i] === challenge) {
                        $scope.challenges.splice(i, 1);
                    }
                }
            }
        };

        $scope.filterOptions = {};

        $scope.sortInfo = {
            fields: ['challengeId'],
            directions: ['asc']
        };

        $scope.pagingOptions = {
            pageSizes: [10, 25, 50, 100],
            pageSize: 10,
            currentPage: 1
        };

        $scope.find = function() {
            var
                pageSize = $scope.pagingOptions.pageSize,
                currentPage = $scope.pagingOptions.currentPage,
                query = {
                    take: pageSize,
                    skip: pageSize * (currentPage-1),
                    filter: $scope.filterOptions,
                    sortInfo: $scope.sortInfo
                };
            Challenges.query(query, function(responce) {
                $scope.totalServerItems = responce.totalCount;
                $scope.challenges = responce.data;
            });
        };



        $scope.gridOptions = {
            enableRowSelection:false,
            data: 'challenges',
            columnDefs: [
                {field:'id', displayName:'ID', width: 75, sort: {direction: 'desc', priority: 1} },
                {field:'title', displayName: 'Title', cellTemplate: '<a data-ng-href="#!/challenges/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a>' },
                {field:'status', displayName: 'status'},
                {field:'createdAt', displayName:'Created', cellFilter: 'date:\'yyyy-MM-dd HH:mm a Z\'' },
                {field:'id', displayName:'', width:75, cellTemplate: '<a class="btn " href="/#!/challenges/{{row.getProperty(col.field)}}/edit"><i class="glyphicon glyphicon-edit"></i></a>' }
            ],
            plugins: [new window.ngGridFlexibleHeightPlugin()],
            rowHeight: 35,
            headerRowHeight: 50,
            enablePaging: true,
            showFooter: true,
            //useExternalSorting: true,
            totalServerItems: 'totalServerItems',
            pagingOptions: $scope.pagingOptions,
            //sortInfo: $scope.sortInfo
        };

        $scope.$watch('pagingOptions', function (newVal, oldVal) {
            if(!newVal || !oldVal || newVal.pageSize === oldVal.pageSize && newVal.currentPage === oldVal.currentPage){
                return;
            }

            if(newVal.pageSize !== oldVal.pageSize ){
                newVal.currentPage = 1;
            }
            $scope.find();
        }, true);

        $scope.$watch('sortInfo', function (newVal, oldVal) {
            if(!newVal || !oldVal){
                return;
            }
            $scope.find();
        }, true);


        $scope.$watch('filterOptions', function (newVal, oldVal) {
            if(!newVal || !oldVal){
                return;
            }
            $scope.pagingOptions.currentPage = 1;
            $scope.find();
        }, true);
    }
]);
