angular.module('d2RollsApp')
    .directive('footerPanel', function () {
        return {
            restrict: 'C',
            controller: 'footerPanelCtrl',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html',
            link: function (scope) {
            }
        }
    })