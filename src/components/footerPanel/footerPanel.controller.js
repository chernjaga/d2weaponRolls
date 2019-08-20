angular.module('d2RollsApp').controller('footerPanelCtrl', ['$state', '$stateParams', '$transitions', 'languageMapService', function (
    $state,
    $stateParams,
    $transitions,
    languageMapService
    ) {
    var vm = this;
    var lang;
    vm.$onInit = function() {
        lang = $stateParams.language || 'en';
        vm.text = languageMapService.getDictionary(lang, 'footerMenu');
        vm.currentState = $state.current.name;
    }
    $transitions.onSuccess({}, function() {
        vm.currentState = $state.current.name;
    });

}]);