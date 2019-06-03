function scaleCtrl () {};

angular.module('d2RollsApp')
    .directive('statScale', function() {
        return {
            restrict: 'E',
            bindToController: {
                value: '<',
                startPosition: '<'
            },
            controller: scaleCtrl,
            controllerAs: 'scale',
            replace: false,
            templateUrl: '../html/components/statScale/statScale.tpl.html',
            link: function(scope, element, attributes, scale) {
                var negativeDiff = element[0].getElementsByClassName('negative')[0];
                var positiveDiff = element[0].getElementsByClassName('positive')[0];
                var primaryStat = element[0].getElementsByClassName('neutral')[0];
                var primaryValue = scale.startPosition;
                var currentValue = scale.value;
                setTimeout(function(){
                    positiveDiff.style.width = currentValue + '%';
                    negativeDiff.style.maxWidth = primaryValue + '%';
                    negativeDiff.style.width = currentValue + '%';
                    primaryStat.style.width = primaryValue + '%';
                });
            }
        }
    });