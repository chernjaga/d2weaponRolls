angular.module('d2RollsApp')
    .directive('statsView', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'statsViewCtrl as stats',
            bindToController: {
                inputStats: '<'
            },
            templateUrl: '../html/components/statsView/statsView.tpl.html'
        };
    });