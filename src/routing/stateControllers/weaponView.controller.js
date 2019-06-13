angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'utils', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    utils
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;

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
    

    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.rarity.hash;
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = {
            primaryData: incomingData
        };

    }, function(incomingData) {
        vm.data.secondaryData = incomingData;
        setWeaponStats(vm.data.secondaryData.stats, vm.data.primaryData.hash);
        getPerksBucket(vm.data.secondaryData.perks);

    }, function(incomingData) {
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = incomingData;      
        setWeaponStats(vm.data.secondaryData.stats, vm.data.primaryData.hash); 
        getPerksBucket(vm.data.secondaryData.perks);
    });

    function setWeaponStats(data, hash) {
        utils.initWeaponStats(data, hash);
        console.log(vm.data);
    }

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