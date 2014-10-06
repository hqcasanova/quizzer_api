(function () {
  'use strict';

  /**
   * @name myApp
   * @desc App-level dependencies and routes. Dependency order dictates module-level routing precedence.
   */
  angular
    .module('quizzer', [
      'ngRoute',
      'quizzer.index',
      'quizzer.new',
      'quizzer.show'
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