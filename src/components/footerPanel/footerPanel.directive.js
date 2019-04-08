angular.module('d2RollsApp')
    .directive('footerPanel', function () {
        return {
            restrict: 'A',
            replace: false,
            controller: 'footerPanelCtrl',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html',
            link: function (scope) {
            }
        }
    })