(function () {
    'use strict';

    var module = angular.module('quizzer');

    module.service('ClassroomService', ClassroomService);
    module.service('CacheService', CacheService);

    ClassroomService.$inject = ['$cookieStore', 'RTCountersFactory'];

    function ClassroomService($cookieStore, RTCountersFactory) {
        this.counters = new RTCountersFactory('classroom');
        this.inc = studentInc;
        this.dec = studentDec;
        this.setQuiz = setQuiz;
        this.exitQuiz = exitQuiz;
        this.isRightQuiz = isRightQuiz;
        this.isEmptyQuiz = isEmptyQuiz;
        this.seeQuestion = seeQuestion;

        function studentInc(property) {
            if (!$cookieStore.get('authenticated')) {
                this.counters.inc(property);
            }
        }

        function studentDec(property) {
            if (!$cookieStore.get('authenticated')) {
                this.counters.dec(property);
            }
        }

        function setQuiz(quizId) {
            if ($cookieStore.get('authenticated')) {
                this.counters.set('quizId', quizId);
            }
        }

        function exitQuiz() {
            this.counters.set('quizId', 0);
            this.counters.set('turnout', 0);
        }

        function isRightQuiz(quizId) {
            return quizId === this.counters.get('quizId');
        }

        function isEmptyQuiz() {
            return this.counters.get('turnout') === 0;
        }

        function seeQuestion(readers) {
            return readers === this.counters.get('size');
        }
    }

    function CacheService() {
        this.cache = {
            items: [ ],
            pageNum: 1,
            isLastPage: false,
        };

        this.dirtyCache = false;
        this.saveFrom = saveFrom;
        this.flushTo = flushTo;

        function saveFrom(paged) {
            this.dirtyCache = true;
            this.cache.items = paged.items;
            this.cache.pageNum = paged.pageNum;
            this.cache.isLastPage = paged.isLastPage;
        }

        function flushTo(paged) {
            this.dirtyState = false;
            paged.items = this.cache.items;
            paged.pageNum = this.cache.pageNum;
            paged.isLastPage = this.cache.isLastPage;
        }
    }
})();