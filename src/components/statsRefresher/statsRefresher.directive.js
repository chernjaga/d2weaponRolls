function statsRefresherCtrl(utils) {
    var vm = this;
    vm.$onInit = getData;
    vm.refresh = getData;
    function getData (){
        utils.getNewStats(function(data){
            vm.data = data;
        });
    }
}

angular.module('d2RollsApp')
    .directive('statsRefresher', function() {
        return {
            restrict: 'A',
            replace: false,
            controller: statsRefresherCtrl,
            controllerAs: 'refresher'
        }
    });