angular.module('d2RollsApp').controller('footerPanelCtrl', ['$stateParams', function ($stateParams) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.lang = $stateParams.language;
        vm.isOpenedSetting = false;
    };
}]);