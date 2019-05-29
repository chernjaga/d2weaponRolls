function perksBinderCtrl(){
    var vm = this;
    vm.bindPerk = function(target) {

        vm.bindedPerk.vendorPerk = target.randomPerk;
        
    };
};

angular.module('d2RollsApp')
    .directive('perksBinder', function () {
        return {
            restrict: 'A',
            replace: false,
            bindToController: {
                bindedPerk: '<'
            },
            controller: perksBinderCtrl,
            controllerAs: 'binder'  
        }
    });