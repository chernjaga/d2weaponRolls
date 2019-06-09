function statsViewRefresherCtrl($timeout) {
    var vm = this;
    vm.$onInit = function() {
        $timeout(vm.refresh);
    }
}

angular.module('d2RollsApp')
    .directive('statsViewRefresher', function() {
        return {
            restrict: 'A',
            replace: false,
            controller: statsViewRefresherCtrl,
            bindToController: {
                refresh: '<'
            }
        }
    });