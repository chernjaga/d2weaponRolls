angular.module('d2RollsApp').controller('weaponPerksPanelCtrl', ['$location', 'utils', function ($location, utils) {
    var vm = this;
    var currentUrl;
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
        utils.collectStats(statsToRecalculate);
        vm.investmentStats = statsToRecalculate;
        $location.search({roll: roll});
        if (callback) {
            callback()
        }
    };
}]);