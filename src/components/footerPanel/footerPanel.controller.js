angular.module('d2RollsApp').controller('footerPanelCtrl', [function () {
    var vm = this;
    vm.text = ' To weapon list';
    vm.lang = location.pathname.split('/')[2] || 'en';
}]);