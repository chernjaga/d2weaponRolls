function menuLinkCtrl($state) {
    var vm = this;
    vm.clickHandler = function() {
        $state.go(vm.goTo, vm.params);
    };
}

angular.module('d2RollsApp')
    .directive('menuLink', function () {
        return {
            restrict: 'E',
            replace: true,
            bindToController: {
                linkClass: '<',
                goTo: '<',
                linkText: '<',
                params: '<'
            },
            templateUrl: '../html/components/menuLink/menuLink.tpl.html',
            controller: menuLinkCtrl,
            controllerAs: 'link'
        };
    });