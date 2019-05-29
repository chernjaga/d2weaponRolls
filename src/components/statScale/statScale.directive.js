angular.module('d2RollsApp')
    .directive('statScale', function() {
        return {
            restrict: 'E',
            replace: false,
            templateUrl: '../html/components/statScale/statScale.tpl.html'
        }
    });