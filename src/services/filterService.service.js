angular.module('d2RollsApp').factory('filterService', ['$q', '$stateParams', 'fetchManifestService', function($q, $stateParams, fetchManifestService) {
    var itemsObject = {};
    var sortType = 'class';
    var applyDefer = $q.defer();
    var filteredItems = {};
    var sortSections = {};
    var fetchItems = new Promise(function(resolve){
        fetchManifestService.getWeaponList($stateParams.language, function(items){
            itemsObject = items;
            resolve(items);
        });
    });

    //todo: language dependency

    function setSortTypeHeaders(initialHashes) {
        var sortBy = 'class'   
        return initialHashes[sortBy];
    };

    function getFilteredItems(callback, filters) {
        if (Object.keys(filteredItems).length) {
            callback(applyFilter(filters, filteredItems));
            return;
        }
        if (!Object.keys(itemsObject).length) {
            fetchItems.then(function(){
                callback(applyFilter(filters, itemsObject));
            });
            return;
        }
        callback(applyFilter(filters, itemsObject));
    };

    function isMatchedToFilter(item, filter) {
        var categoryName = filter.split(':')[0];
        var categoryValue = filter.split(':')[1];

        if (!item[categoryName]) {
            return false;
        }
        if (item[categoryName].name == categoryValue) {
            return true;
        }
        return false;
    };

    function applyFilter(filters, objToFilter) {
        var filtersArray = [];
        var outputArray = [];
        if (!filters) {
            return Object.keys(objToFilter).map(function(key) {
                return objToFilter[key];
            });
        }

        if (typeof filters === 'string') {
            filtersArray.push(filters);
        } else {
            filtersArray = filters;
        }
        for (var item in objToFilter) {
            var isApplied = true;
            for (var section in filtersArray) {
                var currentItem = objToFilter[item];
                var currentFilter = filtersArray[section];
                if (!isMatchedToFilter(currentItem, currentFilter)) {
                    isApplied = false;
                    break;
                }
            }
            if (isApplied) {
                outputArray.push(objToFilter[item]);
                filteredItems[item] = objToFilter[item];
            }
        }

        // if (!outputArray.length) {
        //     console.log('reApply');
        //     return applyFilter(filters, itemsObject);
        // }
        
        applyDefer.resolve();
        return outputArray;
    };

    function resetFilters() {
        filteredItems = {};
    };
    return {
        getFilteredItems: getFilteredItems,
        resetFilters: resetFilters,
        setSortTypeHeaders: setSortTypeHeaders
    };
}]);