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

    function statsFilter (stats) {
        var output = [];
        angular.forEach(stats, function(value, key) {
            if (filterMap[key]){
                value.order = filterMap[key].order;
                value.startPosition = statsStoreObject[key].statValue;
                output.push(value);
            }
        });
        return output;
    };

    function initWeaponStats(stats) {
        statsStoreObject = stats;
        statInit.resolve(stats);
    };

    function collectStats(investmentStats) {
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