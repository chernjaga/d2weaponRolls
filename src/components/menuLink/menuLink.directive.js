function menuLinkCtrl($state, filterService) {
    var vm = this;
    vm.clickHandler = function() {
        var filters = vm.params.filters;
        if (filters) {
            filterService.resetFilters();
            filterService.getFilteredItems(function(data){
                $state.go(vm.goTo, vm.params);
            }, filters);
        } else {
            $state.go(vm.goTo, vm.params);
        }
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
                hashData: '<',
                linkText: '<',
                params: '<'
            },
            templateUrl: '../html/components/menuLink/menuLink.tpl.html',
            controller: menuLinkCtrl,
            controllerAs: 'link',
            link: function(scope, element, attr) {
                if (attr.hashData) {
                    element[0].style.backgroundImage = `url("./img/filterAssets/${scope.link.params.sortBy}/${scope.link.hashData}.png")`;
                }
            }
        };
    });