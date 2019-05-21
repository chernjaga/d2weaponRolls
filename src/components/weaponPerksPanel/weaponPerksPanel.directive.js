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
                var target;
                element.on('mousedown', function(event) {
                    isHolding = true;
                    target = event.target
                    timer = $interval(function() {
                        if (isHolding && target === event.target) {
                            addToolTip(target);
                        }
                    }, 600, 1, true)
                });
                element.on('mouseup', function() {
                    isHolding = false;
                    $interval.cancel(timer);
                });

                function addToolTip(eventTarget) {
                    if (eventTarget.className.includes('perk-icon')) {
                            eventTarget.parentElement.classList.add('has-tooltip')
                    }
                }
            }
        }
    }])