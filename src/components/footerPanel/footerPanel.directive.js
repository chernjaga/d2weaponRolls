angular.module('d2RollsApp')
    .directive('footerPanel', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'footerPanelCtrl',
            controllerAs: 'footer',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html'
        }
    })