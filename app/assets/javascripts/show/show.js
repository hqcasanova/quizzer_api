(function () {
    'use strict';

    /**
     * @name quizzer.show
     * @desc Controller and routes for quiz execution.
     */
    angular
        .module('quizzer.show', [
            'ngRoute',
            'templates'
        ])
        .config(routes)
        .controller('ShowCtrl', ShowCtrl);

    /**
     * @name routes
     * @desc Sets routes related to this module
     * @param $routeProvider Angular service which provides interface to setup routes
     */
    function routes($routeProvider) {
        $routeProvider
            .when('/quizzes/:quizId', {
                templateUrl: 'show.html',
                controller: 'ShowCtrl',
                controllerAs: 'quiz'
            });
    };

    ShowCtrl.$inject = ['$routeParams', '$scope', '$cookieStore', 'PagedIdxFactory', 'ClassroomService', 'RTCountersFactory'];

    //TODO: Separate: quiz controller (this), classroom controller, question factory?
    function ShowCtrl($routeParams, $scope, $cookieStore, PagedIdxFactory, ClassroomService, RTCountersFactory) { 
        var quiz = this,
            quizId = parseInt($routeParams.quizId),
            question = new RTCountersFactory('question'),
            paged = new PagedIdxFactory('/api/quizzes/' + $routeParams.quizId + '/questions', {options: true});
        
        quiz.selected = $cookieStore.get('selectedQuiz');
        quiz.statusText = 'Closed';
        ClassroomService.bindTo($scope);
        quiz.nextQuestion = nextQuestion;
        quiz.openQuestion = openQuestion;
        quiz.isFull = isFull;

        ClassroomService.setQuiz(quizId);
        if (ClassroomService.isRightQuiz(quizId)) {
            ClassroomService.inc('turnout');
            if (!$scope.authenticated) {
                question.onChange('open', onOpenChange);
            }
        }

        if ($scope.authenticated) {
            resetQuestion();
            nextQuestion();     //Retrieve first page of quizzes if current user is not a student
            question.onChange('readers', onReadersChange);
        }

        $scope.$on('$destroy', function () {
            if (ClassroomService.isRightQuiz(quizId)) {
                if (!ClassroomService.isEmptyQuiz()) {
                    ClassroomService.dec('turnout');
                }
                if ($cookieStore.get('authenticated')) {
                    ClassroomService.exitQuiz();
                    question.offChange('readers');
                } else {
                    question.offChange('open');
                }
            }
        });

        function resetQuestion() {
            question.set('open', false);
            question.set('readers', 0);
        }
        
        function update() {
            quiz.end = paged.lastPage;
            quiz.items = paged.items;        
        }

        function nextQuestion() {
            paged
                .getPage()
                .then(update);
            if ($scope.authenticated) {
                quiz.statusText = 'Closed';
            }
        }

        function onReadersChange(snapshot) {
            if (ClassroomService.seeQuestion(snapshot.val())) {
                resetQuestion();
            }
        }

        function onOpenChange(snapshot) {
            if (snapshot.val()) {
                nextQuestion();
                question.inc('readers');
            }
        }

        function openQuestion() {
            if ($scope.authenticated && !question.dataObj.open) {
                question.set('open', true);
                quiz.statusText = 'Opened';
            }
        }

        function isOpen() {
            return question.dataObj.open && !authenticated;
        }

        function isFull() {
            var classroom = $scope.classroom; 
            return (classroom.size === classroom.turnout) || !classroom.quizId;
        }   
    }
})();