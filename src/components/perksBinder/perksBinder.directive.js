function perksBinderCtrl(){
    var vm = this;
    vm.$onInit = function() {
        vm.bindedPerk.vendorPerk = vm.initPerk;
        vm.collectBinded();
    }
    vm.bindPerk = function(target) {
        vm.bindedPerk.vendorPerk = target.randomPerk;
        return false;
    };
};

angular.module('d2RollsApp')
    .directive('perksBinder', function () {
        return {
            restrict: 'A',
            replace: false,
            bindToController: {
                bindedPerk: '<',
                initPerk: '<',
                collectBinded: '<'
            },
            controller: perksBinderCtrl,
            controllerAs: 'binder'
        }
    });