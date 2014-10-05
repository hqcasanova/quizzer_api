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

  ShowCtrl.$inject = ['$routeParams', 'IndexFactory'];

  function ShowCtrl($routeParams, IndexFactory) { 
      var quiz = this,
          index = new IndexFactory('/api/quizzes/' + $routeParams.quizId + '/questions', {options: true});
      //api/quizzes/1/questions?options=true&page=5
      quiz.items = [];
      quiz.moreItems = moreItems;
      quiz.isEnd = isEnd;
     
      //Retrieve first page of quizzes
      index.getPage(quiz);

      function moreItems() {
          index.getPage(quiz);
      }

      function isEnd() {
          return index.isLastPage;
      }
      
  }
})();