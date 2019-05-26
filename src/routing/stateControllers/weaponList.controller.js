angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var sortingType = $stateParams.sortBy;
    var sortingCategory = $stateParams.categories;
    var isFullList = $stateParams.isFullList;
    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];

        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (!isFullList) {
                if (!sortObject[itemObject[sortingType].name] && itemObject[sortingType].name === sortingCategory) {
                    sortObject[itemObject[sortingType].name] = true;
                }
            } else {
                sortObject.all = true;
            }
            itemObject.sortingCategory = itemObject[sortingType] ? itemObject[sortingType].name : 'all';
            itemObject.sortingKey = getSortingKey(itemObject, sortingType, sortingCategory);
            vm.list.push(itemObject);
        };

        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });

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