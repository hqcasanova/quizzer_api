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

  IndexCtrl.$inject = ['$location', '$scope', '$cookieStore', 'PagedIdxFactory', 'CacheService', 'ClassroomService'];

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
  function IndexCtrl($location, $scope, $cookieStore, PagedIdxFactory, CacheService, ClassroomService) { 
      var list = this,
          paged = new PagedIdxFactory('/api/quizzes');
      
      list.reverse = false;
      list.orderField = '';
      list.selected = '';
      list.moreItems = moreItems;
      list.setOrder = setOrder;
      list.isOrderedBy = isOrderedBy;
      list.enterLink = enterLink;
      list.quizUrl = quizUrl;
     
      //Retrieve first page of quizzes (if not cached)
      if (CacheService.dirtyCache) {
          CacheService.flushTo(paged);
          update();
      } else moreItems();

      $scope.$on('$destroy', function () {
          $cookieStore.put('selectedQuiz', list.selected);
          CacheService.saveFrom(paged);
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
          list.end = paged.lastPage;
          list.items = paged.items;        
      }

      function moreItems() {
          paged
              .getPage()
              .then(update);
      }

      function quizUrl(quizId) {
          if (ClassroomService.isRightQuiz(quizId)) {
              return '#/quizzes/' + quizId;
          } else {
              return '';
          }
      }

      //TODO: attribute directive? Visit the only link left if search has filtered out all but one.
      function enterLink(keyEvent, filtered) {
          if ((keyEvent.which === 13) && (filtered.length === 1)) {
              $location.path('/quizzes/' + filtered[0].id);
          }
      }
  }
})();