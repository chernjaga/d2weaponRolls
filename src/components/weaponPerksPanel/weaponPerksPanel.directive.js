angular.module('d2RollsApp')
    .directive('weaponPerksPanel', [ '$interval', function($interval) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                pool: '<',
                text: '<'
            },
            controller: 'perksPanelCtrl',
            templateUrl: '../html/components/weaponPerksPanel/weaponPerksPanel.tpl.html',
            link: function(scope, element, attr) {
                var timer;
                var isHolding = false;
                element.on('mousedown', function(ev) {
                    isHolding = true;
                    timer = $interval(function() {
                        if (isHolding) {
                            addToolTip(ev);
                        }
                    }, 600, 1, true)
                });
                element.on('mouseup', function() {
                    isHolding = false
                });

                function addToolTip(event) {
                    if (event.target.className.includes('perk-icon')) {
                            event.target.parentElement.classList.add('has-tooltip')
                    }
                }
            }
        }
    }])