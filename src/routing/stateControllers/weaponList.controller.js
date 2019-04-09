angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var dictionary = languageMapService.getDictionary(lang);

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = dictionary[lang].search;

    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    }
    vm.test = 'test';
    fetchManifestService.getWeaponList(lang, function(arrayOfItems){
        vm.list = arrayOfItems;
    });
    
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);