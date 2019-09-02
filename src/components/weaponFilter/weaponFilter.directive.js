angular.module('d2RollsApp')
    .directive('weaponFilter', function() {
        return {
            restrict: 'E',
            replace: false,
            controller: 'weaponFilterCtrl as filter',
            templateUrl: '../html/components/weaponFilter/weaponFilter.tpl.html'
        };
    })
    .directive('backgroundSrc', function() {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                backgroundSection: '<',
                backgroundName: '<',
                backgroundUrl: '<',
                gridColumn: '<'
            },
            link: function(scope, element) {
                var isVerticalList = scope.backgroundSection === 'season' ||
                    scope.backgroundSection === 'source';
                var isShortList = scope.backgroundSection === 'ammoType' ||
                    scope.backgroundSection === 'slot' ||
                    scope.backgroundSection === 'damageType';
                if (scope.backgroundUrl) {
                    element[0].style.backgroundImage = `url('https://www.bungie.net${scope.backgroundUrl}')`;
                } else {
                    element[0].style.backgroundImage = `url('./img/filterAssets/${scope.backgroundSection}/${scope.backgroundName}.png')`;
                    element[0].style.backgroundRepeat = 'no-repeat';
                    element[0].style.backgroundOrigin = 'content-box';
                    if (isVerticalList) {
                        element[0].style.backgroundPosition = 'top';
                    } else {
                        element[0].style.backgroundPosition = 'center';
                    }
                }
                if (isShortList) {
                    element[0].style.backgroundSize = "40%"
                } else {
                    element[0].style.backgroundSize = 'cover';
                }
                element[0].style.gridColumn = scope.gridColumn;
            }
        };
    })