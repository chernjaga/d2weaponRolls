angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', function(
    $stateParams,
    fetchManifestService,
    languageMapService
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;
    var lastStats = [];
    var lastStatsValues = {};

    var perksPanel = languageMapService.getDictionary(lang, 'perksPanel');
    var statsPanel = languageMapService.getDictionary(lang, 'statsPanel');

    vm.perksPanelTextContent = {
        perksPanelHeader: perksPanel.header,
        perksPanelExpand: perksPanel.expand,
        perksPanelCollapse: perksPanel.collapse
    };
    vm.statsPanelTextContent = {
        statsPanelHeader: statsPanel.header
    };
    vm.calculatedStats = function (stats, investmentStats) {
        if(!investmentStats) {
            return stats;
        }
        if (lastStats.toString() === investmentStats.toString()) {
            return stats;
        }
        if (!investmentStats || !investmentStats.length) {
            return stats;
        }
        for (var item of investmentStats) {
            var hash = item.statTypeHash
            if (!lastStats.length && stats[hash]) {
                stats[hash].statValue = stats[hash].statValue + item.value;
                lastStatsValues[hash] = item.value;
            } else if (stats[hash]) {
                stats[hash].statValue = stats[hash].statValue + item.value - lastStatsValues[hash];
                lastStatsValues[hash] = item.value;
            }
        }
        lastStats = investmentStats;
        return stats;
    }

    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.rarity.hash;
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = {
            primaryData: incomingData
        };

    }, function(incomingData) {
        vm.data.secondaryData = incomingData;
        getPerksBucket(vm.data.secondaryData.perks);

    }, function(incomingData) {
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = incomingData;       
        getPerksBucket(vm.data.secondaryData.perks);
    });

    function getPerksBucket(data) {
        var roll = $stateParams.roll;
        if (!!roll.length) {
            for (var index = 0; index < roll.length; index++) {
                data[index].vendorPerk = roll[index];
            }
        }
        fetchManifestService.getPerksForSingleWeapon(data, function(perksBucket) {
            vm.perksBucket = perksBucket;
        });
    };

}]);