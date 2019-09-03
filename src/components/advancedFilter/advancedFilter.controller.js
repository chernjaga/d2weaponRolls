angular.module('d2RollsApp').controller('advancedFilterCtrl', [
    '$scope',
    '$stateParams',
    'fetchManifestService',
    'languageMapService',
    function (
        $scope,
        $stateParams,
        fetchManifestService,
        languageMapService
    ) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.text = languageMapService.getDictionary(lang, 'filter').advancedFilter;
        calculatePerkHashes();
        $scope.$on('refresh', function(event, data) {
            refresh(data);
        })
    };

    function refresh(data) {
        vm.foundItems = data;
        calculatePerkHashes();
    }

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
            for (let weapon of vm.foundItems) {
                let weaponHash = weapon.hash; 
                let frame = hash2perk[weaponHash].perks[0].vendorPerk;
                let weaponStatPerk1Array = hash2perk[weaponHash].perks[1] ?
                    hash2perk[weaponHash].perks[1].randomizedPerks : [];
                let weaponStatPerk2Array = hash2perk[weaponHash].perks[2] ?
                    hash2perk[weaponHash].perks[2].randomizedPerks : [];
                let additionalPerk1Array = hash2perk[weaponHash].perks[3] ?
                    hash2perk[weaponHash].perks[3].randomizedPerks : [];
                let additionalPerk2Array = hash2perk[weaponHash].perks[4] ?
                    hash2perk[weaponHash].perks[3].randomizedPerks : [];
                let maxArrayLength = Math.max(
                    weaponStatPerk1Array.length,
                    weaponStatPerk2Array.length,
                    additionalPerk1Array.length,
                    additionalPerk2Array.length
                );
                if (!perksMap.frame[frame]) {
                   perksMap.frame[frame] = {};
                   perksMap.frame[frame] = {
                       name: perksBucket[frame].name,
                       icon: perksBucket[frame].icon,
                       hash: frame
                   };
                }
                for (let index=0; index<maxArrayLength; index++) {
                    let weaponStatPerk1 = weaponStatPerk1Array[index];
                    let weaponStatPerk2 = weaponStatPerk2Array[index];
                    let additionalPerk1 = additionalPerk1Array[index];
                    let additionalPerk2 = additionalPerk2Array[index];
                    if (weaponStatPerk1 &&
                        !perksMap.weaponStatPerk1[weaponStatPerk1] &&
                        perksBucket[weaponStatPerk1]
                    ) {
                        perksMap.weaponStatPerk1[weaponStatPerk1] = {
                            name: perksBucket[weaponStatPerk1].name,
                            icon: perksBucket[weaponStatPerk1].icon,
                            hash: weaponStatPerk1
                        }
                    }
                    if (weaponStatPerk2 &&
                        !perksMap.weaponStatPerk2[weaponStatPerk2] &&
                        perksBucket[weaponStatPerk2]
                    ) {
                        perksMap.weaponStatPerk2[weaponStatPerk2] = {
                            name: perksBucket[weaponStatPerk2].name,
                            icon: perksBucket[weaponStatPerk2].icon,
                            hash: weaponStatPerk2
                        }
                    }
                    if (additionalPerk1 &&
                        !perksMap.additionalPerk1[additionalPerk1] &&
                        perksBucket[additionalPerk1]
                    ) {
                        perksMap.additionalPerk1[additionalPerk1] = {
                            name: perksBucket[additionalPerk1].name,
                            icon: perksBucket[additionalPerk1].icon,
                            hash: additionalPerk1
                        }
                    }
                    if (additionalPerk2 &&
                        !perksMap.additionalPerk2[additionalPerk2] &&
                        perksBucket[additionalPerk2]
                    ) {
                        perksMap.additionalPerk2[additionalPerk2] = {
                            name: perksBucket[additionalPerk2].name,
                            icon: perksBucket[additionalPerk2].icon,
                            hash: additionalPerk2
                        }
                    }
                }
            }
            vm.perksMap = perksMap;
        });
    }
}]);