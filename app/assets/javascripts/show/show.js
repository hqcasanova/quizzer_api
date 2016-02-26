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

    //TODO: Break down into quiz controller (this), classroom controller, question factory. From
    //there, explore the option for a classroom and question directives
    function ShowCtrl($routeParams, $scope, $cookieStore, PagedIdxFactory, ClassroomService, RTCountersFactory) { 
        var quiz = this,
            quizId = parseInt($routeParams.quizId),
            answer = new RTCountersFactory('answer'),
            question = new RTCountersFactory('question'),
            paged = new PagedIdxFactory('/api/quizzes/' + $routeParams.quizId + '/questions', {options: true});
        
        quiz.selected = $cookieStore.get('selectedQuiz');
        quiz.statusText = 'Closed';
        ClassroomService.counters.bindTo($scope);
        answer.bindTo($scope);
        quiz.setClassFull = setClassFull;
        quiz.nextQuestion = nextQuestion;
        quiz.openQuestion = openQuestion;
        quiz.submitAnswer = submitAnswer;
        quiz.isAnswer = isAnswer;
        quiz.isFull = isFull;

        if ($scope.authenticated) {
            resetQuestion();
            resetAnswers();
            nextQuestion();     //Retrieve first page of quizzes if current user is not a student
            question.onChange('readers', onReadersChange);
        }

        ClassroomService.setQuiz(quizId);
        if (ClassroomService.isRightQuiz(quizId)) {
            ClassroomService.inc('turnout');
            if (!$scope.authenticated) {
                question.onChange('open', onOpenChange);
            }
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
            console.log("Readers reseted");
            question.set('open', false);
            question.set('readers', 0);
        }

        function resetAnswers() {
            answer.set('right', 0);
            answer.set('wrong', 0);
        }

        function setClassFull() {
            ClassroomService.setFull();
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
                resetAnswers();
            }
        }

        function onReadersChange(snapshot) {
            console.log("Readers changed: " + snapshot.val());
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
            if ($scope.authenticated && !question.get('open')) {
                question.set('open', true);
                quiz.statusText = 'Opened';
            }
        }

        function isAnswer(question, option) {
            return (question.answer === option) && $scope.authenticated;
        }

        //Tentative implementation. Actually, the client should never see the answer. Best approach is to
        //store the options selected as an array in Firebase and have the "master client" (the teacher)
        //do the checking instead (only the master sees the answer and can update the right/wrong counters)
        //TODO: change Questions controller in API, extend RTCounters to support arrays, change this controller
        //and show view.
        function submitAnswer(question, selOption) {
            if (selOption == question.answer) { 
                answer.inc('right');
            } else {
                answer.inc('wrong');
            }
        }

        function isOpen() {
            return question.get('open') && !authenticated;
        }

        function isFull() {
            var classroom = $scope.classroom; 
            return (classroom.size === classroom.turnout) || !classroom.quizId;
        }   
    }
})();