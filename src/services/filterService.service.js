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
    var sortByObject = {};

    //todo: language dependency

    function getFilteredItems(callback, filters, isFilterState, sortBy) {
        if (!sortBy) {
            if (isFilterState) {
                sortBy = setSortBy(filters);
            }  else {
                sortBy = 'class';
            }
        }
        if (filteredItems.length && !isFilterState) {
            callback(filteredItems, sortByObject);
            return;
        }
        if (!Object.keys(itemsObject).length) {
            fetchItems.then(function(){
                callback(applyFilter(filters, itemsObject, sortBy), sortByObject);
            });
            return;
        }
        callback(applyFilter(filters, itemsObject, sortBy), sortByObject);
    }

    function setSortBy(filters) {
        var filterMap = initFiltersMap(filters);
        if (!filterMap.season && !filterMap.source) {
            if (filterMap.class && filterMap.class.length < 3) {
                return 'frame';
            }
        }
    }

    function applyFilter(inputFilters, objToFilter, sort) {
        sortByObject = {};
        var filtersMap = initFiltersMap(inputFilters);
        var outputArray = [];
        if (filtersMap.class) {
            filtersMap.class.forEach(function(filterValue) {
                outputArray = outputArray.concat(applyFilterPart(objToFilter, filtersMap, filterValue, sort));
            });
        } else {
            outputArray = applyFilterPart(objToFilter, filtersMap, null , sort);
        }
        filteredItems = outputArray;
        applyDefer.resolve();
        return outputArray;
    }

    function applyFilterPart(objToFilter, filters, weaponClass, sort) {
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
                            if (valuesName === 'source' && item.source.bindTo) {
                                isApplied = isApplied && filterValueArray.includes(item.source.bindTo) ||
                                    filterValueArray.includes(item.source.bindTo1) ||
                                    filterValueArray.includes(item.source.name);
                            } else {
                                isApplied = isApplied && filterValueArray.includes(item[valuesName].name);
                            }
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
                if (sort && !sortByObject[item[sort].name]) {
                    sortByObject[item[sort].name] = true;
                }
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
        resetFilters: resetFilters
    };
}]);