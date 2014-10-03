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

  //TO BE BROKEN DOWN: Seems that this will be just the controller for pagination
  function IndexCtrl($http, $location) { 
    var index = this;
    
    index.quizzes = [ ];
    index.reverse = false;
    index.orderField = '';
    index.pageNum = 1;
    index.lastPage = false;

    //TODO: ordered list controller-directive? Sets the sorting criteria for the quiz list. 
    index.setOrder = function(orderField) {
        index.reverse = !index.reverse;
        index.orderField = orderField;
    };

    //TODO: ordered list controller-directive? Checks if a given field is being used for sorting
    index.isOrderedBy = function(orderField) {
        return orderField === index.orderField;
    };

    //TODO: attribute directive? Visit the only link left if search has filtered out all but one.
    index.enterLink = function(keyEvent, filtered) {
        if ((keyEvent.which === 13) && (filtered.length === 1)) {
            $location.path('/quizzes/' + filtered[0].id);
        }
    };

    //Updates the list of quizzes by appending the ones corresponding to the next page. It also flags when
    //the last page has been retrieved.
    index.nextPage = function(page) {
        index.lastPage = page.pop();    //last item = comparison on the server between page number and number of pages
        index.quizzes = index.quizzes.concat(page);
        index.pageNum += 1;
    };

    //Inside a factory? Grabs the paginated, JSON-formatted list of quizzes from the server.
    index.moreQuizzes = function(pageNumber) {
        $http({
            url: '/api/quizzes', 
            method: "GET",
            params: {page: pageNumber}
        }).success(function(data) {
            index.nextPage(data);
            return data;
        }).error(function() {
            alert('Problem encountered while fetching the JSON list of quizzes');
            return -1;
        });
    };  

    //Very first page
    index.moreQuizzes(index.pageNum);
  }
})();