angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', function(
    $stateParams,
    fetchManifestService
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;
    
    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = Object.assign(incomingData.primaryData, incomingData.secondaryData);
        
        console.log(vm.data);
    });

}]);