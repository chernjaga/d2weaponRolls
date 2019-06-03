function scaleCtrl () {
    var vm = this;
    vm.$onInit = function() {
        var startPosition = vm.value;
        vm.startPosition = startPosition;
    }
}

angular.module('d2RollsApp')
    .directive('statScale', function() {
        return {
            restrict: 'E',
            bindToController: {
                value: '<'
            },
            controller: scaleCtrl,
            controllerAs: 'scale',
            replace: false,
            templateUrl: '../html/components/statScale/statScale.tpl.html'
        }
    });