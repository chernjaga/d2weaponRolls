angular.module('d2RollsApp').factory('utils', ['$q', function($q) {
    var statsStoreObject = {};
    var recalculatedStats = {};
    var statInit = $q.defer();
    var recalculateDeffer = $q.defer();
    var filterMap = {
        '4043523819': {
            order: 1
        }, //impact
        '3614673599': {
            order: 1.1
        }, //blastRadius
        '1240592695': {
            order: 2
        }, //range
        '2523465841': {
            order: 2.1
        }, //velocity
        '15562408': {
            order: 3
        }, //stability
        '155624089': {
            order: 3.1
        }, // GL stability
        '943549884': {
            order: 4
        }, //handling
        '4188031367': {
            order: 5
        }, //reload speed
        '4284893193': {
            order: 6
        }, // RPM
        '2961396640': {
            order: 6.1
        }, // Charge time
        '447667954': {
            order: 6.2
        }, // Draw time
        '3871231066': {
            order: 7
        }, //magazine
        '1345609583': {
            order: 8
        }, //aim assist
        '1591432999': {
            order: 9
        }, //accuracy
        '3555269338': {
            order: 10
        }, //zoom
        
    };

    function statsFilter (stats) {
        var output = [];
        angular.forEach(stats, function(value, key) {
            if (filterMap[key] && statsStoreObject[key]){
                value.order = filterMap[key].order;
                value.startPosition = statsStoreObject[key].statValue;
                output.push(value);
            }
        });
        return output;
    }

    function initWeaponStats(stats) {
            statsStoreObject = JSON.parse(JSON.stringify(stats));
            statInit.resolve(stats);        
    }

    function collectStats(investmentStats) {
        if (Object.keys(statsStoreObject).length) {
            recalculateStats(investmentStats);
            return;
        }
        $q.when(statInit.promise).then(function() {
            recalculateStats(investmentStats);
        });
    }

    function recalculateStats(newStats) {
        recalculatedStats = JSON.parse(JSON.stringify(statsStoreObject));
        for (item of newStats) {
            var hash = item.statTypeHash;
            if (recalculatedStats[hash]) {
                recalculatedStats[hash].statValue = statsStoreObject[hash].statValue + item.value;
            }
        }
        
        recalculateDeffer.resolve(recalculatedStats);
    }

    function getNewStats(callback) {
        $q.when(recalculateDeffer.promise).then(function() {
            var output = statsFilter(recalculatedStats);
            callback(output);
        });
    }

    return {
        collectStats: collectStats,
        initWeaponStats: initWeaponStats,
        getNewStats: getNewStats
    };
}]);