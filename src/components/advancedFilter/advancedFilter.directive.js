angular.module('d2RollsApp')
    .directive('advancedFilter', function () {
        return {
            restrict: 'E',
            replace: false,
            bindToController: {
                foundItems: '<'
            },
            controller: 'advancedFilterCtrl as advancedFilter',
            templateUrl: '../html/components/advancedFilter/advancedFilter.tpl.html'
        }
    });