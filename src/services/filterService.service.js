angular.module('d2RollsApp').factory('filterService', ['$q', '$stateParams', 'fetchManifestService', function($q, $stateParams, fetchManifestService) {
    var itemsArray = [];
    var sortType = 'class';
    var applyDefer = $q.defer();
    var sortSections = {};
    var fetchItems = new Promise(function(resolve){
        fetchManifestService.getWeaponList($stateParams.language, function(items){
            itemsArray = items;
            resolve(items);
        });
    });

    //todo: language dependency

    function setSortTypeHeaders(initialHashes) {
        var sortBy = 'class'
        
        return initialHashes[sortBy];
    };

    function getFilteredItems(callback, filters) {
        if (!itemsArray.length) {
            fetchItems.then(function(){
                callback(applyFilter(filters, itemsArray));
            });
            return;
        }

        callback(applyFilter(filters, itemsArray));
    };

    function isMatchedToFilter(item, filter) {
        var categoryName = filter.split(':')[0];
        var categoryValue = filter.split(':')[1];
        if (item.appliedFilter && item.appliedFilter[categoryName]) {
            return true;
        }
        if (!item[categoryName]) {
            return false;
        }
        if (item[categoryName].name === categoryValue) {
            if (!item.appliedFilter) {
                item.appliedFilter = {};
                item.appliedFilter[categoryName] = true;
            }
            return true;
        }
        return false;
    };

    function applyFilter(filters, arrayToFilter) {
        if (!filters.length) {
            return arrayToFilter;
        }
        var filtersArray = [];
        var outputArray = [];
        if (typeof filters === 'string') {
            filtersArray.push(filters);
        } else {
            filtersArray = filters;
        }
        for (var item in arrayToFilter) {
            var isApplied = true;
            for (var section in filtersArray) {
                var currentItem = arrayToFilter[item];
                var currentFilter = filtersArray[section];
                if (!isMatchedToFilter(currentItem, currentFilter)) {
                    isApplied = false;
                    break;
                };
            }
            if (isApplied) {
                outputArray.push(arrayToFilter[item]);
            }
        }
        
        applyDefer.resolve();
        return outputArray;
    };

    function resetFilters() {
        filteredItems = [];
    };
    return {
        getFilteredItems: getFilteredItems,
        resetFilters: resetFilters,
        setSortTypeHeaders: setSortTypeHeaders
    };
}]);