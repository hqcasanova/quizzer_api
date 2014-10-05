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

  IndexCtrl.$inject = ['$location', 'IndexFactory'];

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
  function IndexCtrl($location, IndexFactory) { 
      var list = this,
          index = new IndexFactory('/api/quizzes');
      
      list.items = [ ];
      list.reverse = true;
      list.orderField = 'updated_at';
      list.moreItems = moreItems;
      list.isEnd = isEnd;
      list.setOrder = setOrder;
      list.isOrderedBy = isOrderedBy;
      list.enterLink = enterLink;
     
      //Retrieve first page of quizzes
      index.getPage(list);

      //TODO: ordered list controller-directive? Sets the sorting criteria for the quiz list. 
      function setOrder(orderField) {
          list.reverse = !list.reverse;
          list.orderField = orderField;
      };

      //TODO: ordered list controller-directive? Checks if a given field is being used for sorting
      function isOrderedBy(orderField) {
          return orderField === list.orderField;
      };

      function moreItems() {
          index.getPage(list);
      }

      function isEnd() {
          return index.isLastPage;
      }

      //TODO: attribute directive? Visit the only link left if search has filtered out all but one.
      function enterLink(keyEvent, filtered) {
          if ((keyEvent.which === 13) && (filtered.length === 1)) {
              $location.path('/quizzes/' + filtered[0].id);
          }
      };
  }
})();