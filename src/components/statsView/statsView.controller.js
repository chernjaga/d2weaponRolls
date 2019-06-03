angular.module('d2RollsApp').controller('statsViewCtrl', ['utils', function (utils) {
    var vm = this;

    var filterMap = {
        '4043523819': {
            statName: null,
            statValue: null,
            order: 1
        }, //impact
        '1240592695': {
            statName: null,
            statValue: null,
            order: 2
        }, //range
        '15562408': {
            statName: null,
            statValue: null,
            order: 3
        }, //stability
        '943549884': {
            statName: null,
            statValue: null,
            order: 4
        }, //handling
        '4188031367': {
            statName: null,
            statValue: null,
            order: 5
        }, //reload speed
        '1345609583': {
            statName: null,
            statValue: null,
            order: 6
        }, //aim assist
        '4284893193': {
            statName: null,
            statValue: null,
            order: 7
        }, // RPM
        '3871231066': {
            statName: null,
            statValue: null,
            order: 8
        } //magazine
    };
    vm.statsFilter = function (stats) {
        var output = [];
        angular.forEach(stats, function(value, key) {
            if (filterMap[key]){
                value.order = filterMap[key].order;
                output.push(value);
            }
        });
        return output;
    }
}]);