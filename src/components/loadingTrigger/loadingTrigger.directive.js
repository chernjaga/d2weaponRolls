angular.module('d2RollsApp')
    .directive('loadingTrigger', function ($rootScope) {
        return {
            restrict: 'A',
            replace: false,
            link: function(scope, element) {
                element.on('click', function() {
                    console.log('trigerred');
                    $rootScope.$emit('changeStateStart');
                });
            }
        };
    });