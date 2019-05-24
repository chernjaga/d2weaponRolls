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

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (!sortObject[itemObject[sortingType].name]) {
                sortObject[itemObject[sortingType].name] = true;
            }
            itemObject.sortingCategory = itemObject[sortingType].name;
            vm.list.push(itemObject);
        };
        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);