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
    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];

        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (isShownByFilter(itemObject, filters) || isFullList) {
                vm.list.push(itemObject);
                if (!itemObject[itemObject.class.name]) {
                    sortObject[itemObject.class.name] = true;
                }
            }
        }
        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });

    function isShownByFilter(item, filters) {
        var filtersArray = [];
        var isApplied = false;
        if (typeof filters === 'string') {
            filtersArray.push(filters)
        } else {
            filtersArray = filters;
        }
        for (var filter in filtersArray) {
            var categoryName = filtersArray[filter].split(':')[0];
            var categoryValue = filtersArray[filter].split(':')[1];
            if (item[categoryName].name === categoryValue) {
                isApplied = true;
                break;
            }
        }

        return isApplied;
    }

    function getSortingKey(dataObject, sortingType, category) {
        if (!$stateParams.isFullList) {
            if (dataObject[sortingType].name === category) {
                return true;
            }
        } else {
            return true;
        }

        return false;
    }

    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);