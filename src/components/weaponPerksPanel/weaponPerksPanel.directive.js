angular.module('d2RollsApp')
    .directive('weaponPerksPanel', function () {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                pool: '<',
                text: '<',
            },
            controller: function($scope) {
                $scope.isExpanded = false;
            },
            templateUrl: '../html/components/weaponPerksPanel/weaponPerksPanel.tpl.html'
        }
    })