(function () {
    'use strict';

    angular
        .module('quizzer')
        .service('CacheService', CacheService);

    function CacheService() {
        this.cache = {
            items: [ ],
            pageNum: 1,
            isLastPage: false, 
            selected: ''
        };

        this.dirtyCache = false;
        this.saveFrom = saveFrom;
        this.flushTo = flushTo;

        function saveFrom(index, selected) {
            this.dirtyCache = true;
            this.cache.items = index.items;
            this.cache.pageNum = index.pageNum;
            this.cache.isLastPage = index.isLastPage;
            this.cache.selected = selected;
        }

        function flushTo(index) {
            this.dirtyCache = false;
            index.items = this.cache.items;
            index.pageNum = this.cache.pageNum;
            index.isLastPage = this.cache.isLastPage;
        }
    }
})();