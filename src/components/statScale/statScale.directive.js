function scaleCtrl () {
    var vm = this;
    var startPosition = vm.value;
    vm.definition = vm.value - startPosition;
    
    if (vm.definition > 0) {
        vm.direction = 'positive';
        vm.width = vm.definition;
        vm.marginLeft = 0;
    }
    if (vm.definition < 0) {
        vm.direction = 'negative';
        vm.width = -vm.definition;
        vm.marginLeft = -vm.definition;
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