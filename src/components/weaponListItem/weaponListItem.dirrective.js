angular.module('d2RollsApp')
    .directive('weaponListItem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: '<',
                language: '<'
            },
            templateUrl: '../html/components/weaponListItem/weaponListItem.tpl.html',
        }
    })