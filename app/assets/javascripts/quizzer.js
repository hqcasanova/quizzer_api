(function () {
  'use strict';

  /**
   * @name myApp
   * @desc App level routes and dependencies.
   */
  angular
    .module('quizzer', [
      'ngRoute',
      'quizzer.index',
      'quizzer.new'
    ])
    .config(routes);

  /**
   * @name routes
   * @desc Sets routes related to this module
   * @param $routeProvider Angular service which provides interface to setup routes
   */  
  function routes($routeProvider) {
     $routeProvider.otherwise({redirectTo: '/quizzes'});
  }

})();