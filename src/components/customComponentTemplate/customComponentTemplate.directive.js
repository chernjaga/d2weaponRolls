angular.module('d2RollsApp')
    .directive('customComponentTemplate', function () {
        return {
            replace: false,
            restrict: 'E',
            scope: {
                myText: '<'
            },
            templateUrl: '../html/components/customComponentTemplate/customComponentTemplate.tpl.html'
        }
    });