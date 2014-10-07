/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

angular.module('mean.challenges').controller('ListChallengesController', ['$scope', '$stateParams', '$location', '$sce', 'Global', 'Challenges',
  function ($scope, $stateParams, $location, $sce, Global, Challenges) {
    $scope.global = Global;

    $scope.pagingOptions = {
      pageSizes: [10, 25, 50, 100],
      pageSize: 25,
      currentPage: 1
    };
    $scope.pagination = [];
    $scope.initPageDone = false;

    $scope.remove = function (challenge) {
      if (challenge) {
        challenge.$remove();

        for (var i in $scope.challenges) {
          if ($scope.challenges[i] === challenge) {
            $scope.challenges.splice(i, 1);
          }
        }
        //update pagination index here
        $scope.pagination = [];
        for (var j = 0; j <= $scope.challenges.length / $scope.pagingOptions.pageSize; j += 1) {
          $scope.pagination.push(j + 1);
        }
      }
    };

    $scope.filterOptions = {};

    $scope.sortInfo = {
      fields: ['updatedAt'],
      directions: ['desc']
    };

    //here we need to get the total amount of challenges to initialize the page index.
    Challenges.query({
      take: 1000,
      skip: $scope.pagingOptions.pageSize * ($scope.pagingOptions.currentPage - 1),
      filter: $scope.filterOptions,
      sortInfo: $scope.sortInfo
    }, function (responce) {
      //initialize pagination index here.
      if (!$scope.initPageDone) {
        $scope.pagination = [];
        for (var i = 0; i <= responce.data.length / $scope.pagingOptions.pageSize; i += 1) {
          $scope.pagination.push(i + 1);
        }
        $scope.initPageDone = true;
      }
    });

    $scope.find = function () {
      var
        pageSize = $scope.pagingOptions.pageSize,
        currentPage = $scope.pagingOptions.currentPage,
        query = {
          take: pageSize,
          skip: pageSize * (currentPage - 1),
          filter: $scope.filterOptions,
          sortInfo: $scope.sortInfo
        };
      Challenges.query(query, function (responce) {
        $scope.totalServerItems = responce.totalCount;
        $scope.challenges = responce.data;
      });
    };


    //header template. customize it with css style.
    var headerTemplate =
      '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{ \'ngSorted\': !noSortVisible, \'center\': col.displayName===\'Action\' }">' +
      '<div ng-click="col.sort($event)" ng-class="\'colt\' + col.index" class="ngHeaderText">' +
      '{{col.displayName}}' +
      '<i ng-hide="col.showSortButtonDown() || col.showSortButtonUp() || col.displayName===\'Action\'"></i>' +
      '<i class="activeUp" ng-show="col.showSortButtonUp() && col.displayName!==\'Action\'"></i>' +
      '<i class="activeDown" ng-show="col.showSortButtonDown() && col.displayName!==\'Action\' "></i>' +
      '</div>' +
      '<div class="ngSortPriority">{{col.sortPriority}}</div>' +
      '<div ng-class="{ ngPinnedIcon: col.pinned, ngUnPinnedIcon: !col.pinned }" ng-click="togglePin(col)" ng-show="col.pinnable"></div>' +
      '</div>' +
      '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

    // here is the footer template. You can modify them with css style in the future.
    var footerTemplate =
      '<div ng-show="showFooter" class="ngFooterPanel" ng-class="{\'ui-widget-content\': jqueryUITheme, \'ui-corner-bottom\': jqueryUITheme}" ng-style="footerStyle()">' +
      '<div class="ngTotalSelectContainer" >' +
      '<div class="ngFooterTotalItems" ng-class="{\'ngNoMultiSelect\': !multiSelect}" >' +
      '<span class="ngLabel">Showing items <b>{{1+pagingOptions.pageSize*(pagingOptions.currentPage-1)}}-{{pagingOptions.pageSize*pagingOptions.currentPage>maxRows()? maxRows():pagingOptions.pageSize*pagingOptions.currentPage}}</b> of <b>{{maxRows()}}</b></span>' +
      '<span ng-show="filterText.length > 0" class="ngLabel">({{i18n.ngShowingItemsLabel}} {{totalFilteredItemsLength()}})</span>' +
      '</div>' +
      '<div class="ngFooterSelectedItems" ng-show="multiSelect">' +
      '<span class="ngLabel">{{i18n.ngSelectedItemsLabel}} {{selectedItems.length}}</span>' +
      '</div>' +
      '</div>' +
      '<div class="ngPagerContainer" ng-show="enablePaging" ng-class="{\'ngNoMultiSelect\': !multiSelect}">' +
      '<div class="ngRowCountPicker">' +
      '<span class="ngLabel">Pages : </span>' +
      '</div>' +
      '<div class="ngPagerControl">' +
      '<a class="previous" ng-click="pageBackward()" ng-disabled="cantPageBackward()" ng-class="{currentNavi: cantPageBackward()}">Prev</a>' +
      '<a class="pagesNumber" ng-repeat="p in pagination track by $index" ng-click="pagingOptions.currentPage=p" ng-disabled="p===pagingOptions.currentPage" ng-class="{current: p===pagingOptions.currentPage}">{{p}}</a>' +
      '<a class="next" ng-click="pageForward()" ng-disabled="cantPageForward()" ng-class="{currentNavi: cantPageForward()}">Next</a>' +
      '</div>' +
      '</div>';

    $scope.gridOptions = {
      enableRowSelection: false,
      data: 'challenges',
      columnDefs: [
        {field: 'id', displayName: 'ID', width: 75, sort: {direction: 'desc', priority: 1}, visible: false},
        {
          field: 'title',
          displayName: 'Name',
          cellClass: 'standard-cell',
          cellTemplate: '<div class="title-cell"><a data-ng-href="#!/challenges/{{row.getProperty(\'id\')}}">{{row.getProperty(col.field)}}</a></div>',
          headerCellTemplate: headerTemplate,
          width: 240
        },
        {field: 'createdBy', displayName: 'Account', headerCellTemplate: headerTemplate, cellClass: 'standard-cell'},
        {
          field: 'updatedAt',
          displayName: 'Last Updated',
          cellFilter: 'date:\'yyyy/MM/dd hh:mm a Z\'',
          headerCellTemplate: headerTemplate,
          cellClass: 'standard-cell'
        },
        {field: 'status', displayName: 'Status', headerCellTemplate: headerTemplate, cellClass: 'standard-cell'},
        {field: 'type', displayName: 'type', visible: false},
        {field: 'createdAt', displayName: 'Created', cellFilter: 'date:\'yyyy/MM/dd hh:mm a Z\'', visible: false},
        {
          field: 'id',
          displayName: 'Action',
          width: 120,
          cellClass: 'standard-cell',
          sortable: false,
          cellTemplate: '<div class="action-cell">' +
          '<div class="action-cell-icon">' +
          '<a class="btn " href="/#!/challenges/{{row.getProperty(col.field)}}/edit">' +
          '<i class="fa fa-edit fa-2x"></i>' +
          '</a>' +
          '</div>' +
          '<div class="action-delete-icon">' +
          '<a class="btn " href="" ng-show="row.getProperty(\'status\')===\'draft\'">' +
          '<i class="fa fa-trash-o fa-2x"></i>' +
          '</a>' +
          '</div>' +
          '</div>',
          headerCellTemplate: headerTemplate
        }
      ],
      plugins: [new window.ngGridFlexibleHeightPlugin()],
      rowHeight: 49,
      headerRowHeight: 50,
      enablePaging: true,
      showFooter: true,
      showFilter: true,
      //useExternalSorting: true,
      totalServerItems: 'totalServerItems',
      pagingOptions: $scope.pagingOptions,
      sortInfo: $scope.sortInfo,
      footerTemplate: footerTemplate
    };

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
      if (!newVal || !oldVal || newVal.pageSize === oldVal.pageSize && newVal.currentPage === oldVal.currentPage) {
        return;
      }

      if (newVal.pageSize !== oldVal.pageSize) {
        newVal.currentPage = 1;
      }
      $scope.find();
    }, true);

    $scope.$watch('sortInfo', function (newVal, oldVal) {
      if (!newVal || !oldVal) {
        return;
      }
      $scope.find();
    }, true);


    $scope.$watch('filterOptions', function (newVal, oldVal) {
      if (!newVal || !oldVal) {
        return;
      }
      $scope.pagingOptions.currentPage = 1;
      $scope.find();
    }, true);
  }
]);
