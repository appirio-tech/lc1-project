'use strict';

angular.module('mean.articles').controller('ArticlesController', ['$scope', '$stateParams', '$location', '$modal', 'Global', 'Articles', 'ArticlesByTag',
  function($scope, $stateParams, $location, $modal, Global, Articles, ArticlesByTag) {
    $scope.global = Global;

    $scope.hasAuthorization = function(article) {
      if (!article || !article.user) return false;
      return $scope.global.isAdmin || article.user._id === $scope.global.user._id;
    };

    $scope.create = function(isValid) {
      if (isValid) {
        var article = new Articles({
          title: this.title,
          content: this.content,
          tags: this.tags,
        });
        article.$save(function(response) {
          $location.path('articles/' + response._id);
        });

        this.title = '';
        this.content = '';
        this.tags = '';
      } else {
        $scope.submitted = true;
      }
    };

    $scope.remove = function(article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function(response) {
          $location.path('articles');
        });
      }
    };

    $scope.update = function(isValid) {
      if (isValid) {
        var article = $scope.article;
        if (!article.updated) {
          article.updated = [];
        }
        article.updated.push(new Date().getTime());

        article.$update(function() {
          $location.path('articles/' + article._id);
        });
      } else {
        $scope.submitted = true;
      }
    };

    $scope.find = function() {
      Articles.query(function(articles) {
        $scope.articles = articles;
      });
    };

    $scope.findByTag = function() {
      ArticlesByTag.query({
        mytag: $stateParams.mytag
      }, function(articles) {
        $scope.articles = articles;

      });
    };

    $scope.findOne = function() {
      Articles.get({
        articleId: $stateParams.articleId
      }, function(article) {
        $scope.article = article;
      });
    };

    /*
     * code changes for just markdown
     */

    // Initially preview is off, which is Edit mode.
    $scope.preview = false;   // Edit mode
    $scope.previewButtonText = 'Preview';
    $scope.togglePreviewEdit = function() {
      console.log('togglePreviewEdit: ', $scope.preview);
      $scope.preview = ! $scope.preview;
      if ($scope.preview) {
        $scope.previewButtonText = 'Edit';
      } else {
        $scope.previewButtonText = 'Preview';
      }
    };

    $scope.showMarkdownHelp = function() {
      console.log('markdownHelp: ');
      $modal.open({
        templateUrl: 'markdownHelpModal.html',
        controller: 'MarkdownHelpModalController',
        size: 'sm'
      });
    };

  }
])
// markdown help modal controller
.controller('MarkdownHelpModalController', ['$scope', '$modalInstance', function($scope, $modalInstance) {

    $scope.close = function () {
      $modalInstance.close();
    };
}])
// news controller   This section gets the accordian for the Info on the home page
.controller('NewsArticleController', ['$scope', '$stateParams', '$location', 'Global', 'ArticlesByTag',
  function($scope, $stateParams, $location, Global, ArticlesByTag) {
    $scope.global = Global;


    // show more or less news articles
    var limitStep = 5;
      $scope.limit = limitStep;
      $scope.incrementLimit = function() {
          $scope.limit += limitStep;
      };
      $scope.decrementLimit = function() {
          $scope.limit -= limitStep;
      };



    $scope.findByTag = function() {
      ArticlesByTag.query({
        mytag: 'news'
      }, function(articles) {
        $scope.articles = articles;

      });
    };

  }
]);
