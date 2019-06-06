angular.module('d2RollsApp').factory('utils', ['$q', function($q) {
    var contentHeight;
    var statsStoreObject = {};
    var recalculatedStats = {};
    var statInit = $q.defer();
    var recalculateDeffer = $q.defer();
    var filterMap = {
        '4043523819': {
            statName: null,
            statValue: null,
            order: 1
        }, //impact
        '3614673599': {
            statName: null,
            statValue: null,
            order: 1.1
        }, //blastRadius
        '1240592695': {
            statName: null,
            statValue: null,
            order: 2
        }, //range
        '2523465841': {
            statName: null,
            statValue: null,
            order: 2.1
        }, //velocity
        '15562408': {
            statName: null,
            statValue: null,
            order: 3
        }, //stability
        '155624089': {
            statName: null,
            statValue: null,
            order: 3.1
        }, // GL stability
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
        '4284893193': {
            statName: null,
            statValue: null,
            order: 6
        }, // RPM
        '2961396640': {
            statName: null,
            statValue: null,
            order: 6.1
        }, // Charge time
        '447667954': {
            statName: null,
            statValue: null,
            order: 6.2
        }, // Draw time
        '3871231066': {
            statName: null,
            statValue: null,
            order: 7
        }, //magazine
        '1345609583': {
            statName: null,
            statValue: null,
            order: 8
        }, //aim assist
        '1591432999': {
            statName: null,
            statValue: null,
            order: 9
        }, //accuracy
        '3555269338': {
            statName: null,
            statValue: null,
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
    };

    function initWeaponStats(stats, hash) {
        // if (!Object.keys(statsStoreObject).length || statsStoreObject.hash == hash) {
            statsStoreObject = stats;
            statsStoreObject.hash = hash;
            statInit.resolve(stats);
        // } else {
        //     statsStoreObject.hash = hash;
        //     statInit.resolve(statsStoreObject);
        // };
        
    };

    function collectStats(investmentStats, hash) {
        if (Object.keys(statsStoreObject).length) {
            recalculateStats(investmentStats);
            return;
        }
        $q.when(statInit.promise).then(function() {
            recalculateStats(investmentStats);
        });
    };

    function recalculateStats(newStats) {
        recalculatedStats = JSON.parse(JSON.stringify(statsStoreObject));
        for (item of newStats) {
            var hash = item.statTypeHash;
            if (recalculatedStats[hash]) {
                recalculatedStats[hash].statValue = statsStoreObject[hash].statValue + item.value;
            }
        }
        recalculateDeffer.resolve(recalculatedStats);
    };

    function getNewStats(callback) {
        $q.when(recalculateDeffer.promise).then(function() {
            var output = statsFilter(recalculatedStats);
            callback(output);
        });
    };

    function setContentHeight() {
        if (contentHeight) {
            return contentHeight
        }
      
        var footer = document.getElementsByClassName('footer-menu')[0];
        var bodyHeight = footer.getBoundingClientRect().bottom;
        var footerHeight = getComputedStyle(footer).height.replace('px', '');
        var menuHeight = bodyHeight - footerHeight
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight - 32 + 'px';
    };

    return {
        collectStats: collectStats,
        setContentHeight: setContentHeight,
        initWeaponStats: initWeaponStats,
        getNewStats: getNewStats
    };
}]);