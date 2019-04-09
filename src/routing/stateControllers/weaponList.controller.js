angular.module('d2RollsApp').controller('weaponListCtrl', ['$state', 'fetchManifestService', function(
    $state,
    fetchManifestService
){
    var vm = this;
    vm.getRarityClass = getRarityClass;

    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    }
    vm.test = 'test';
    fetchManifestService.getWeaponList('ru', function(arrayOfItems){
        vm.list = arrayOfItems;
    });
    
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);