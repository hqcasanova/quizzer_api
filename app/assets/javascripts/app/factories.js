(function () {
    'use strict';

    var module = angular.module('quizzer');
        
    module.factory('RTCountersFactory', RTCountersFactory);
    module.factory('PagedIdxFactory', PagedIdxFactory);

    RTCountersFactory.$inject = ['$firebase'];
    PagedIdxFactory.$inject = ['$http'];

    function RTCountersFactory($firebase) {
        var ref = new Firebase("https://torid-fire-8167.firebaseio.com/"),
            rtCounter = function(objectName) {
                var _this = this,
                    classSynced;

                this.name = objectName;    
                classSynced = $firebase(ref.child(this.name));
                
                this.dataObj = classSynced.$asObject();
                this.callbackOnChange = null;

                this.inc = inc;
                this.dec = dec;
                this.set = set;
                this.onChange = onChange;
                this.offChange = offChange;

                function onChange(property, callback) {
                    _this.callbackOnChange = ref.child(this.name + '/' + property).on('value', callback, function (errorObject) {
                        console.log('Error encountered while listening to a value change for ' + this.name + '/' + property);
                    });
                }

                function offChange(property) {
                    ref.child(this.name + '/' + property).off('value', _this.callbackOnChange);
                }

                function set(property, value) {
                    classSynced.$set(property, value);
                } 

                function inc(property) {
                    set(property, _this.dataObj[property] + 1);
                } 

                function dec(property) {
                    set(property, _this.dataObj[property] - 1);
                }
            };

        return rtCounter;
    }

    function PagedIdxFactory($http) {
        var index = function(indexUrl, indexParams) {
            indexParams = indexParams || { };

            var _this = this;

            this.getPage = getPage;
            this.url = indexUrl;
            this.params = indexParams;
            this.items = [ ];
            this.pageNum = 1;
            this.lastPage = false;

            //Updates page counter and flags when the last page has been retrieved.
            function addPage(page) {
                _this.lastPage = page.pop();    //last item = comparison on the server between page number and number of pages
                _this.items = _this.items.concat(page);
                _this.pageNum += 1;
            }

            //Grabs the paginated, JSON-formatted page of quizzes from the server and adds it to the list.
            function getPage() {
                return $http({
                    url: _this.url, 
                    method: "GET",
                    params: angular.extend (_this.params, {page: this.pageNum})
                }).success(function(data) {
                    addPage(data);
                }).error(function() {
                    alert('Problem encountered while fetching the JSON list of quizzes');
                });
            }
        };

        return index;
    }

})();