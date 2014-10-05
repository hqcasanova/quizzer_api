(function () {
    'use strict';

    angular
        .module('quizzer.index')
        .factory('IndexFactory', IndexFactory);

    IndexFactory.$inject = ['$http'];

    function IndexFactory($http) {
        var index = function(indexUrl, indexParams) {
            indexParams = indexParams || { };

            var _this = this;

            this.items = [ ];
            this.pageNum = 1;
            this.isLastPage = false;
            this.getPage = getPage;
            this.url = indexUrl;
            this.params = indexParams;

            //Updates page counter and flags when the last page has been retrieved.
            function addPage(list, page) {
                _this.isLastPage = page.pop();    //last item = comparison on the server between page number and number of pages
                list.items = list.items.concat(page);
                _this.pageNum += 1;
            };

            //Grabs the paginated, JSON-formatted page of quizzes from the server and adds it to the list.
            function getPage(list) {
                $http({
                    url: _this.url, 
                    method: "GET",
                    params: angular.extend (_this.params, {page: this.pageNum})
                }).success(function(data) {
                    addPage(list, data);
                }).error(function() {
                    alert('Problem encountered while fetching the JSON list of quizzes');
                });
            };
        };

        return index;
    }

})();