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

  IndexCtrl.$inject = ['$location', '$scope', 'IndexFactory', 'CacheService'];

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
  function IndexCtrl($location, $scope, IndexFactory, CacheService) { 
      var list = this,
          index = new IndexFactory('/api/quizzes');
      
      list.reverse = false;
      list.orderField = '';
      list.selected = '';
      list.moreItems = moreItems;
      list.setOrder = setOrder;
      list.isOrderedBy = isOrderedBy;
      list.enterLink = enterLink;
     
      //Retrieve first page of quizzes (if not cached)
      if (CacheService.dirtyCache) {
          CacheService.flushTo(index);
          update();
      } else moreItems();

      $scope.$on('$destroy', function () {
          CacheService.saveFrom(index, list.selected);
      });

      //TODO: ordered list controller-directive? Sets the sorting criteria for the quiz list. 
      function setOrder(orderField) {
          list.reverse = !list.reverse;
          list.orderField = orderField;
      }

      //TODO: ordered list controller-directive? Checks if a given field is being used for sorting
      function isOrderedBy(orderField) {
          return orderField === list.orderField;
      }

      function update() {
          list.isEnd = index.isLastPage;
          list.items = index.items;        
      }

      function moreItems() {
          index
              .getPage()
              .then(update);
      }

      //TODO: attribute directive? Visit the only link left if search has filtered out all but one.
      function enterLink(keyEvent, filtered) {
          if ((keyEvent.which === 13) && (filtered.length === 1)) {
              $location.path('/quizzes/' + filtered[0].id);
          }
      }
  }
})();