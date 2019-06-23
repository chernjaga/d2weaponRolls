angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var isFullList = $stateParams.isFullList;
    var filters = $stateParams.filters;
    // var sortType = $stateParams.sortBy;
    var sortType = 'class';
    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;
    vm.isFilterActive = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];

        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (isShownByFilter(itemObject, filters) || isFullList) {
                itemObject.sortType = itemObject[sortType].name;
                vm.list.push(itemObject);
                if (!itemObject[itemObject[sortType].name]) {
                    sortObject[itemObject[sortType].name] = true;
                }
            }
        }
        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });

    function isShownByFilter(item, filters, hashFilter) {
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

    function getRarityClass(hash) {

        return rarityMap[hash];
    };
}]);