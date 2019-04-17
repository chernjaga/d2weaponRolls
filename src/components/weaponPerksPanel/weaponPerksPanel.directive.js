angular.module('d2RollsApp')
    .directive('weaponPerksPanel', function () {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '../html/components/weaponPerksPanel/weaponPerksPanel.tpl.html'
        }
    })