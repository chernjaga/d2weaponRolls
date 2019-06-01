angular.module('d2RollsApp').factory('utils', ['$q', function($q) {
    var contentHeight;
    var statsStoreObject = {};
    var recalculatedStats = {};
    var statInit = $q.defer();
    var recalculateDeffer = $q.defer();


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
            callback(recalculatedStats);
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