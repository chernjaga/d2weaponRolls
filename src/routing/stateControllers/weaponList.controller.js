angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var dictionary = languageMapService.getDictionary(lang);
    var rarityMap = fetchManifestService.rarityMap

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = dictionary.search;
    vm.lang = lang;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems){
        vm.list = [];
        for (let item in arrayOfItems) {
            vm.list.push(arrayOfItems[item]);

        }
    });
    
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);