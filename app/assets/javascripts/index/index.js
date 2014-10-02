(function () {
  'use strict';

  /**
   * @name quizzer.index
   * @desc Controller and routes for quiz list
   */
  angular
    .module('quizzer.index', [
      'ngRoute',
      'templates'
    ])
    .config(routes)
    .controller('IndexCtrl', IndexCtrl);

  IndexCtrl.$inject = ['$http', '$filter'];

  /**
   * @name routes
   * @desc Sets routes related to this module
   * @param $routeProvider Angular service which provides interface to setup routes
   */    
  function routes($routeProvider) {
    $routeProvider
      .when('/quizzes', {
        templateUrl: 'index.html',
        controller: 'IndexCtrl',
        controllerAs: 'index'
      });
  }

  function IndexCtrl($http, $filter) { 
    var index = this,
        orderBy = $filter('orderBy');
    
    index.quizzes = [ ];
    index.reverse = false;

    //Sets the sorting criteria for the quiz list. 
    index.setOrder = function(orderField) {
        index.reverse = !index.reverse;
        index.quizzes = orderBy(index.quizzes, orderField, index.reverse);
    };

    index.showQuiz = function(keyEvent, filtered) {
        if ((keyEvent.which === 13) && (filtered.length == 1)) {
            //redirectTo('/quizzes/' + filtered[0].id);
        }
    }

    //Grabs the JSON-formatted list of quizzes from the server and the properties for each
    //entry on the list.
    $http.get('/api/quizzes').success(function(data) {
        index.quizzes = data;
    });
  }

})();