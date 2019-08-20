angular.module('d2RollsApp').factory('filterService', ['$q', '$stateParams', 'fetchManifestService', function($q, $stateParams, fetchManifestService) {
    var itemsObject = {};
    var applyDefer = $q.defer();
    var filteredItems = [];
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
    }

    function getFilteredItems(callback, filters, isFilterState) {
        if (filteredItems.length && !isFilterState) {
            callback(filteredItems);
            return;
        }
        if (!Object.keys(itemsObject).length) {
            fetchItems.then(function(){
                callback(applyFilter(filters, itemsObject));
            });
            return;
        }
        callback(applyFilter(filters, itemsObject));
    }

    function applyFilter(inputFilters, objToFilter) {
        var filtersMap = initFiltersMap(inputFilters);
        var outputArray = [];
        if (filtersMap.class) {
            filtersMap.class.forEach(function(filterValue) {
                outputArray = outputArray.concat(applyFilterPart(objToFilter, filtersMap, filterValue));
            });
        } else {
            outputArray = applyFilterPart(objToFilter, filtersMap);
        }
        filteredItems = outputArray;
        applyDefer.resolve();
        return outputArray;
    }

    function applyFilterPart(objToFilter, filters, weaponClass) {
        var outputPart = [];
        for (var hash in objToFilter) {
            var item = objToFilter[hash];
            var isApplied = true;
            if (Object.keys(filters).length === 1 && filters.class) {
                isApplied = item.class.name === weaponClass
            } else {
                for (var valuesName in filters) {
                    var filterValueArray = filters[valuesName];
                    
                    if (valuesName !== 'class') {
                        item[valuesName].name = item[valuesName].name.toString();
                        if (weaponClass) {
                            isApplied = isApplied && filterValueArray.includes(item[valuesName].name) && item.class.name === weaponClass;
                        } else {
                            isApplied = isApplied && filterValueArray.includes(item[valuesName].name);
                        }
                    } else if (valuesName === 'class') {
                        isApplied = isApplied && filterValueArray.includes(weaponClass);
                    } else {
                        isApplied = false;
                    }
                };
            }
            if (isApplied) {
                outputPart.push(item);
            }
        }
        return outputPart;
    }

    function initFiltersMap(filters) {
        if (typeof filters === 'string') {
            filters = [filters];
        }
        var map = {};
        filters.forEach(function(filter) {
            var key = filter.split(':')[0];
            var value = filter.split(':')[1];
            if (!map[key]) {
                map[key] = [value];
            } else {
                map[key].push(value)
            }
        });

        return map;
    }

    function resetFilters() {
        filteredItems = {};
    }

    return {
        getFilteredItems: getFilteredItems,
        resetFilters: resetFilters,
        setSortTypeHeaders: setSortTypeHeaders
    };
}]);