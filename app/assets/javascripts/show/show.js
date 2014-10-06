(function () {
  'use strict';

  /**
   * @name quizzer.show
   * @desc Controller and routes for quiz execution.
   */
  angular
      .module('quizzer.show', [
          'ngRoute',
          'templates'
      ])
      .config(routes)
      .controller('ShowCtrl', ShowCtrl);

  /**
   * @name routes
   * @desc Sets routes related to this module
   * @param $routeProvider Angular service which provides interface to setup routes
   */
  function routes($routeProvider) {
      $routeProvider
          .when('/quizzes/:quizId', {
              templateUrl: 'show.html',
              controller: 'ShowCtrl',
              controllerAs: 'quiz'
          });
  };

  ShowCtrl.$inject = ['$routeParams', 'IndexFactory', 'CacheService'];

  function ShowCtrl($routeParams, IndexFactory, CacheService) { 
      var quiz = this,
          index = new IndexFactory('/api/quizzes/' + $routeParams.quizId + '/questions', {options: true});
      
      quiz.moreItems = moreItems;
      quiz.selected = CacheService.cache.selected;
     
      //Retrieve first page of quizzes
      moreItems();

      function update() {
          quiz.isEnd = index.isLastPage;
          quiz.items = index.items;        
      }

      function moreItems() {
          index
              .getPage()
              .then(update);
      }
      
  }
})();