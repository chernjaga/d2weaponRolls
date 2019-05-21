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
                var isCompletedEvent = false;
                element.on('mousedown touchstart', function(event) {
                    isHolding = true;
                    target = event.target;
                    var previousElement = element[0].getElementsByClassName('has-tooltip')[0];

                    if (previousElement) {
                        previousElement.classList.remove('has-tooltip');
                    }

                    timer = $interval(function() {
                        if (isHolding && target === event.target) {
                            addToolTip(target);
                            isCompletedEvent = true;
                            event.returnValue = false;
                        }
                    }, 300, 1, true);
                });
                element.on('mouseup touchend', function(event) {
                    isHolding = false;
                    $interval.cancel(timer);
                    if (isCompletedEvent) {
                        event.returnValue = false;
                    }
                });

                function addToolTip(eventTarget) {
                    if (eventTarget.className.includes('perk-icon')) {
                            eventTarget.parentElement.classList.add('has-tooltip');
                    }
                };
            }
        };
    }]);