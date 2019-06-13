angular.module('d2RollsApp')
    .directive('weaponFilter', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'weaponFilterCtrl as filter',
            templateUrl: '../html/components/weaponFilter/weaponFilter.tpl.html'
        };
    });