angular.module('d2RollsApp').factory('filterService', ['$q', '$stateParams', 'fetchManifestService', function($q, $stateParams, fetchManifestService) {
    var itemsArray = [];
    var filteredItems = [];
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

    function setSortType(newType) {
        sortType = newType; 
    };

    function getFilteredItems(callback, filters ,isReset) {
        if (!itemsArray.length) {
            fetchItems.then(function(items){
                callback({
                    items: applyFilter(filters, itemsArray),
                    sections: sortSections
                })
            });
            return;
        }

        callback({
            items: applyFilter(filters, itemsArray),
            sections: sortSections
        });
    };

    function isShownByFilter(item, filters, isCombinedFilter) {
        var filtersArray = [];
        var isApplied = false;
        if (typeof filters === 'string') {
            filtersArray.push(filters);
        } else {
            filtersArray = filters;
        }
        for (var filter in filtersArray) {
            var categoryName = filtersArray[filter].split(':')[0];
            var categoryValue = filtersArray[filter].split(':')[1];
            if (!item[categoryName]) {
                return false;
            }
            if (item[categoryName].name == categoryValue) {
                isApplied = true;
                break;
            }
        }
        return isApplied;
    };

    function applyFilter(filters, arrayToFilter) {
        for (var item in arrayToFilter) {
            var itemObject = arrayToFilter[item];
            if (isShownByFilter(itemObject, filters)) {
                itemObject.sortType = itemObject[sortType].name;
                filteredItems.push(itemObject);
                if (!itemObject[itemObject[sortType].name]) {
                    sortSections[itemObject[sortType].name] = true;
                }
            }
        }
        applyDefer.resolve();
        return filteredItems;
    };

    function resetFilters() {
        filteredItems = [];
    };
    return {
        getFilteredItems: getFilteredItems,
        sortSections: sortSections,
        resetFilters: resetFilters,
        setSortType: setSortType,
        applyFilter: applyFilter
    };
}]);