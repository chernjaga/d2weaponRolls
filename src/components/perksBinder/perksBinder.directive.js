function perksBinderCtrl(){
    var vm = this;
    vm.bindPerk = function(target, callback) {
        vm.bindedPerk.vendorPerk = target.randomPerk;
        callback();
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
                activeHash: '<'
            },
            controller: perksBinderCtrl,
            controllerAs: 'binder'
        }
    });