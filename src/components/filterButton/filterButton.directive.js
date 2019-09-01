angular.module('d2RollsApp')
    .directive('filterButton', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'filterButtonCtrl as filterButton',
            templateUrl: '../html/components/filterButton/filterButton.tpl.html'
        }
    });