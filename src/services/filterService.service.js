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
    var sortByParam = 'class';
    var propertyIndexMap = {
        frame: 0,
        weaponStatPerk1: 1,
        weaponStatPerk2: 2,
        additionalPerk1: 3,
        additionalPerk2: 4
    };
    var p2h;
    //todo: language dependency
    fetchManifestService.getPerk2hash(function(perk2hash, perksBucket, hash2perk){
        p2h = perk2hash;
    })

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
        if (filterMap.season && !filterMap.source) {
            sortByParam = 'season';
            return 'season';
        }
        if (!filterMap.season && filterMap.source) {
            sortByParam = 'subSource';
            return 'subSource';
        }
        if (!filterMap.season && !filterMap.source) {
            if (filterMap.class && filterMap.class.length === 1) {
                sortByParam = 'frame';
                return 'frame';
            }
        }
        sortByParam = 'class';
        return 'class';
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
                    if (valuesName === 'frame' ||
                        valuesName === 'weaponStatPerk1' ||
                        valuesName === 'weaponStatPerk2' ||
                        valuesName === 'additionalPerk1' ||
                        valuesName === 'additionalPerk2'
                    ) {
                        if (!weaponClass) {
                            isApplied = isApplied && isPerkBelong(valuesName, filterValueArray, hash);
                        } else {
                            isApplied = isApplied && isPerkBelong(valuesName, filterValueArray, hash) && item.class.name === weaponClass;
                        }
                    } else {
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

    function isPerkBelong(indexName, valuesArray, weaponHash) {
        var index = propertyIndexMap[indexName];
        var isBelong = true;
        fetchManifestService.getWeaponData(function(data) {
            var weaponPerks;
            if (data[weaponHash].perks[index]) {
                weaponPerks = data[weaponHash].perks[index].randomizedPerks;
                weaponPerks.forEach(function(value) {
                    var isInWeapon = p2h[value] ? !! p2h[value].includes(weaponHash) : false;
                    
                    hk1J9QKC
                    isBelong = valuesArray.includes(value.toString());
                });
            } else {
                isBelong = false;
            }
        });
        return isBelong;
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

    function getSortParam() {
        return sortByParam;
    }

    return {
        getFilteredItems: getFilteredItems,
        getSortParam: getSortParam,
        resetFilters: resetFilters
    };
}]);