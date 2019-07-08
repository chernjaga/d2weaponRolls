angular.module('d2RollsApp').controller('weaponFilterCtrl', [
    '$q',
    '$state',
    '$stateParams',
    'filterService',
    'languageMapService',
    'fetchManifestService',
    function (
        $q,
        $state,
        $stateParams,
        filterService,
        languageMapService,
        fetchManifestService
    ) {
    var vm = this;
    var lang = $stateParams.language;
    var includedFilters = [];
    var hashToName;
    var filterInit = $q.defer();
    fetchManifestService.getHashToName(function(initialHashes) {
        console.log(initialHashes);
        hashToName = initialHashes;
        filterInit.resolve();
    }, lang);

    $q.when(filterInit.promise).then(function(){
        vm.text = languageMapService.getDictionary(lang, 'filter');
        vm.classes = hashToName.class;
        vm.slots = [2,3,4];
        vm.ammoTypes = [1,2,3];
        vm.damageTypes = {
            '2303181850': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_9fbcfcef99f4e8a40d8762ccb556fcd4.png',
            '3373582085': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_3385a924fd3ccb92c343ade19f19a370.png',
            '1847026933': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
            '3454344768':'/common/destiny2_content/icons/DestinyDamageTypeDefinition_290040c1025b9f7045366c1c7823da6a.png'
        };
        vm.rarity = ['exotic', 'legendary', 'rare', 'uncommon', 'common'];
        vm.toggleFilter = function(target, filterBy, hash) {
            target.isIncluded = !target.isIncluded;
            console.log(hash, filterBy);
        };
    });
    filterService.resetFilters();
    
}]);