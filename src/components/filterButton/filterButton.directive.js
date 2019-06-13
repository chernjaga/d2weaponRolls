angular.module('d2RollsApp')
    .directive('filterButton', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: function() {
                this.isExpanded = false;
            },
            controllerAs: 'filterButton',
            templateUrl: '../html/components/filterButton/filterButton.tpl.html'
        }
    });