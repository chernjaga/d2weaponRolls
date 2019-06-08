angular.module('d2RollsApp').controller('weaponPerksPanelCtrl', ['$location', '$stateParams','utils', function ($location, $stateParams, utils) {
    var vm = this;
    var currentUrl;
    var hash = $stateParams.weaponHash;
    vm.collectRoll = function(isManualEvent, callback){
        if (currentUrl === $location.url() && !isManualEvent) {
            return;
        }

        var perksCollection = vm.pool;
        var roll = [];
        var statsToRecalculate = [];
        for (var perk in perksCollection) {
            var investmentStats = perksCollection[perk].vendorPerk.investmentStats;
            if (!!investmentStats.length) {
                statsToRecalculate = statsToRecalculate.concat(investmentStats);
            }
            roll.push(perksCollection[perk].vendorPerk.hash);
        }
        currentUrl = $location.url();
        utils.collectStats(statsToRecalculate, hash);
        vm.investmentStats = statsToRecalculate;
        $location.search({roll: roll});
        if (callback) {
            callback()
        }
    };
}]);