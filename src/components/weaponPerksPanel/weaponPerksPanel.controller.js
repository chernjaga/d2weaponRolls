angular.module('d2RollsApp').controller('weaponPerksPanelCtrl', ['$location', function ($location) {
    var vm = this;
    vm.collectRoll = function(){
        var perksCollection = vm.pool;
        var roll = [];
        for (var perk in perksCollection) {
            roll.push(perksCollection[perk].vendorPerk.hash);
        }
        $location.search({roll: roll});

    };
}]);