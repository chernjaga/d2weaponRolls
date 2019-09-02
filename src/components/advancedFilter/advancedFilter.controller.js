angular.module('d2RollsApp').controller('advancedFilterCtrl', [
    '$stateParams',
    'fetchManifestService',
    'languageMapService',
    function (
        $stateParams,
        fetchManifestService,
        languageMapService
    ) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.text = languageMapService.getDictionary(lang, 'filter').advancedFilter;
        calculatePerkHashes();
    };

    function calculatePerkHashes() {
        fetchManifestService.getPerk2hash(function(perk2hash, perksBucket, hash2perk){
            var perksMap = {
                frame: {},
                weaponStatPerk1: {},
                weaponStatPerk2: {},
                additionalPerk1: {},
                additionalPerk2: {},
                absolutePerk: {}
            };
            for (var weapon of vm.foundItems) {
                var weaponHash = weapon.hash; 
                var frame = hash2perk[weaponHash].perks[0].vendorPerk;
                if (!perksMap.frame[frame]) {
                   perksMap.frame[frame] = {};
                   perksMap.frame[frame] = {
                       name: perksBucket[frame].name,
                       icon: perksBucket[frame].icon,
                   };
                }
            }
        });
    }
}]);