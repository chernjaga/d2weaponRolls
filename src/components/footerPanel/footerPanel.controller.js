angular.module('d2RollsApp').controller('footerPanelCtrl', ['$rootScope', '$state', '$stateParams', '$transitions', 'languageMapService', function (
    $rootScope,
    $state,
    $stateParams,
    $transitions,
    languageMapService
    ) {
    var vm = this;

    vm.clickHandler = function() {
        $rootScope.$emit('changeStateStart');
    }
   
    $transitions.onSuccess({}, function() {
        if (!vm.text) {
            vm.text = languageMapService.getDictionary($stateParams.language, 'footerMenu');
        }
        vm.currentState = $state.current.name;
    });

}]);