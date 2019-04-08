angular.module('d2RollsApp').controller('weaponListCtrl', ['$state', 'fetchManifestService', function(
    $state,
    fetchManifestService
){
    var vm = this;
    vm.test = 'test';
    fetchManifestService.getWeaponList('ru', function(arrayOfItems){
        vm.list = arrayOfItems;
    });
    console.log('test');
}]);