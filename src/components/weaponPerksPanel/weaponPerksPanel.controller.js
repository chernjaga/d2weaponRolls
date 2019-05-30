angular.module('d2RollsApp').controller('weaponPerksPanelCtrl', ['$location', function ($location) {
    var vm = this;
    vm.collectRoll = function(){
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
        vm.investmentStats = statsToRecalculate;
        $location.search({roll: roll});
    };
    vm.collectRoll();

}]);