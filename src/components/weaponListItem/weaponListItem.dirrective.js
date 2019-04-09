angular.module('d2RollsApp')
    .directive('weaponListItem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: '='
            },
            templateUrl: '../html/components/weaponListItem/weaponListItem.tpl.html',
        }
    })