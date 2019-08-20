function spinnerCtrl($timeout, $rootScope) {
    var vm = this;
    vm.isLoading = true;
    $rootScope.$on('changeStateStart', function() {
        vm.isLoading = true;
    });
    $rootScope.$on('changeStateFinish', function() {
        $timeout(function() {
            vm.isLoading = false;
        });
    });
}

angular.module('d2RollsApp')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: spinnerCtrl,
            controllerAs: 'spinner',
            templateUrl: '../html/components/spinner/spinner.tpl.html'
        }
    });