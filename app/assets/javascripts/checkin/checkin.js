(function () {
    'use strict';

    /**
     * @name quizzer.checkin
     * @desc Controller and routes for quiz execution.
     */
    angular
        .module('quizzer.checkin', [
            'ngRoute',
            'ngCookies',
            'templates'
        ])
        .config(routes)
        .controller('CheckinCtrl', CheckinCtrl);

    /**
     * @name routes
     * @desc Sets routes related to this module
     * @param $routeProvider Angular service which provides interface to setup routes
     */
    function routes($routeProvider) {
          $routeProvider.when('/checkin', {
              templateUrl: 'checkin.html',
              controller: 'CheckinCtrl',
              controllerAs: 'checkin'
          });
      }

    CheckinCtrl.$inject = ['$cookieStore', '$rootScope', '$location', 'ClassroomService'];

    function CheckinCtrl($cookieStore, $rootScope, $location, ClassroomService) {
        var checkin = this;

        if (!$rootScope.checkedin) {
             $cookieStore.remove('authenticated');
        }

        if ($cookieStore.get('email')) {
            $location.path('/quizzes');
        } else {    
            checkin.roles = [
                {id: 0, title: 'Student'},
                {id: 1, title: 'Teacher'}
            ];
            checkin.role = checkin.roles[0].id;
            checkin.validate = validate;
        }

        function validate() {
            $cookieStore.put('email', checkin.email);
            $cookieStore.put('authenticated', checkin.role);
            $rootScope.authenticated = checkin.role;
            $rootScope.checkedin = true;
            ClassroomService.inc("size");
            $location.path('/quizzes');
        }
    }
})();