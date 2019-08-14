angular.module('d2RollsApp')
    .directive('loadingTrigger', function ($rootScope) {
        return {
            restrict: 'A',
            scope: {
                finishOnLast: '<'
            },
            replace: false,
            link: function(scope, element, attr) {
                if (attr.loadingTrigger === 'isFinishState' || scope.finishOnLast) {
                    $rootScope.$emit('changeStateFinish');
                }
                element.on('click', function() {
                    if (attr.loadingTrigger === 'startOnClick') {
                        $rootScope.$emit('changeStateStart');
                    }            
                });
            }
        };
    });