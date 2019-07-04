angular.module('d2RollsApp').controller('footerPanelCtrl', ['$state', '$stateParams', '$transitions', 'languageMapService', function (
    $state,
    $stateParams,
    $transitions,
    languageMapService
    ) {
    var vm = this;
   
    $transitions.onSuccess({}, function() {
        if (!vm.text) {
            vm.text = languageMapService.getDictionary($stateParams.language, 'footerMenu');
        }
        vm.currentState = $state.current.name;
    });

}]);