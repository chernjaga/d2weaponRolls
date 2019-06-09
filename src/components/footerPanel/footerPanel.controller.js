angular.module('d2RollsApp').controller('footerPanelCtrl', ['$state', '$stateParams', function ($state, $stateParams) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.lang = $stateParams.language;
        vm.isOpenedSetting = false;
        vm.changeLanguage = function() {
            var params = $stateParams;
            params.language = $stateParams.language === 'ru' ? 'en' : 'ru';
            var stateName = $state.current.name;
            vm.isOpenedSetting = false;
            $state.go(stateName, params);
        }
    };
}]);