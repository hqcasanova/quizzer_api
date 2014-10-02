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

  IndexCtrl.$inject = ['$http', '$location'];

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

  //TO BE BROKEN DOWN
  function IndexCtrl($http, $location) { 
    var index = this;
    
    index.quizzes = [ ];
    index.reverse = false;
    index.orderField = '';
    index.page = 1;
    index.lastPage = false;

    //TODO: ordered list controller/directive. Sets the sorting criteria for the quiz list. 
    index.setOrder = function(orderField) {
        index.reverse = !index.reverse;
        index.orderField = orderField;
    };

    //TODO: ordered list controller/directive.
    index.isOrderedBy = function(orderField) {
        return orderField === index.orderField;
    };

    //TODO: attribute directive.
    index.enterLink = function(keyEvent, filtered) {
        if ((keyEvent.which === 13) && (filtered.length === 1)) {
            $location.path('/quizzes/' + filtered[0].id);
        }
    };

    index.nextPage = function(page) {
        if (page.length > 0) {
            index.quizzes = index.quizzes.concat(page);
            index.page += 1;
        } else if (page.length === 0) {
            index.lastPage = true;
        } else {
            alert('Problem encountered while appending next page.');
        }
    };

    //Factory?: Grabs the paginated, JSON-formatted list of quizzes from the server.
    index.moreQuizzes = function(pageNumber) {
        $http({
            url: '/api/quizzes', 
            method: "GET",
            params: {page: pageNumber}
        }).success(function(data) {
            index.nextPage(data);
            return data;
        }).error(function() {
            return -1;
        });
    };  

    index.moreQuizzes(index.page);
  }
})();