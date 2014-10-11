(function () {
    'use strict';

    /**
     * @name Quizzer
     * @desc Naive MVP of real-time quiz single-page application.
     * Assumptions:
     *      One teacher signed in at a time. 
     *      No dual accounts (teacher <=> student)
     *      The app is only used in one classroom => just one Firebase storage instance
     *      The students will be physically present in the classroom together with their teacher (no remote use)
     * To be fully implemented:
     *      Creation / Edition of a given quiz
     *      Proper authentication for teacher / checkin for students
     *      Boolean flag for correct option for every question => stats display after each question
     *      Validation of forms
     *      Allocation of quizzes to students
     *      Incorporate use of Answers table for historical archive  
     *      UX/UI
     */
    angular
        .module('quizzer', [
          'ngCookies',
          'ngRoute',
          'firebase',
          'quizzer.checkin',
          'quizzer.index',
          'quizzer.new',
          'quizzer.show'
        ])
        .run(appInit)
        .config(routes);

    /**
     * @name routes
     * @desc Sets routes related to this module
     * @param $routeProvider Angular service which provides interface to setup routes
     */  
    function routes($routeProvider) {
       $routeProvider.otherwise({redirectTo: '/checkin'});
    }

    //TODO: Cookies - eventually, it will use session ones and will be of form ('quizzer', {all info})
    //Encapsulate into a service (neater since gets rid of rootScope). Might use Firebase's simplelogin instead
    function appInit($rootScope, $cookieStore, $location, ClassroomService) {
        $rootScope.quit = quit;
        $rootScope.checkedin = $cookieStore.get('email');
        if ($rootScope.checkedin) {
            $rootScope.authenticated = $cookieStore.get('authenticated');
        } else {
            $location.path('/checkin');
        }

        function quit() {
            ClassroomService.dec("size");
            $rootScope.authenticated = false;
            $rootScope.checkedin = false;
            $cookieStore.remove('email');
            $cookieStore.remove('selectedQuiz');
        }
    } 
})();