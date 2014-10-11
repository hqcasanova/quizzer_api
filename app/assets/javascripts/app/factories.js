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
                    syncedObj = null,
                    callbackOnChange = null;
                
                this.name = objectName;
                syncedObj = synced(_this.name).$asObject();
                this.get = get;
                this.set = set;
                this.inc = inc;
                this.dec = dec;
                this.bindTo = bindTo;
                this.onChange = onChange;
                this.offChange = offChange;

                function get(property) {
                    return syncedObj[property];
                }

                function set(property, value) {
                    synced(_this.name).$set(property, value);
                }

                function synced(child) {
                    return $firebase(ref.child(child));
                } 

                function bindTo(scope) {
                    scope[_this.name] = syncedObj;
                    syncedObj.$bindTo(scope, _this.name);
                }

                function transaction(property, updateFn) {
                    return synced(_this.name + '/' + property).$transaction(updateFn, false)
                        .then(function(snapshot) {
                            if (!snapshot) {
                                console.log('Error: the transaction involving property ' + property + ' was aborted');
                            } 
                        }, function(error) {
                            console.log('Error encountered while setting up a transaction for ' + this.name + '/' + property);
                        });
                }

                function inc(property) {
                    transaction(property, function (currentValue) {
                        return (currentValue || 0) + 1;
                    }, false);
                } 

                function dec(property) {
                    transaction(property, function (currentValue) {
                        return (currentValue || 0) - 1;
                    }, false);
                }

                function onChange(property, callback) {
                    callbackOnChange = ref.child(_this.name + '/' + property).on('value', callback, function (errorObject) {
                        console.log('Error encountered while listening to a value change for ' + _this.name + '/' + property);
                    });
                }

                function offChange(property) {
                    ref.child(_this.name + '/' + property).off('value', callbackOnChange);
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
                    console.log('Problem encountered while fetching the JSON list of quizzes');
                });
            }
        };

        return index;
    }

})();