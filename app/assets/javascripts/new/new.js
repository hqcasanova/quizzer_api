(function () {
  'use strict';

  /**
   * @name quizzer.create
   * @desc Controller and routes for quiz creation
   */
  angular
    .module('quizzer.new', [
      'ngRoute',
      'templates'
    ])
    .config(routes)
    .controller('NewCtrl', NewCtrl);

  /**
   * @name routes
   * @desc Sets routes related to this module
   * @param $routeProvider Angular service which provides interface to setup routes
   */    
  function routes($routeProvider) {
    $routeProvider
      .when('/quizzes/new', {
        templateUrl: 'new.html',
        controller: 'NewCtrl'
      });
  }

  function NewCtrl() { }

})();