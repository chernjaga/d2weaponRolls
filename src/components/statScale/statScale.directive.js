function scaleCtrl () {
    var vm = this;
}

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
            templateUrl: '../html/components/statScale/statScale.tpl.html'
        }
    });