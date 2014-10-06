(function () {
    'use strict';

    angular
        .module('quizzer')
        .service('CacheService', CacheService);

    function CacheService() {
        this.cache = {
            items: [ ],
            pageNum: 1,
            isLastPage: false
        };

        this.dirtyCache = this.cache.pageNum > 1;
        this.saveToCache = saveFrom;
        this.flushToCache = flushTo;

        function saveFrom(index) {
            this.cache.items = index.items;
            this.cache.pageNum = index.pageNum;
            this.cache.isLastPage = index.isLastPage;
        }

        function flushTo(index) {
            index.items = this.cache.items;
            index.pageNum = this.cache.pageNum;
            index.isLastPage = this.cache.isLastPage;
        }
    }
})();