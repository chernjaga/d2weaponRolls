angular.module('d2RollsApp')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: function($scope, $timeout, $rootScope) {

                $rootScope.$on('changeStateStart', function() {
                    $scope.isLoading = true;
                });
                $rootScope.$on('$viewContentLoaded', function() {
                    $timeout(function() {
                        $scope.isLoading = false;
                    });
                });
            },
            templateUrl: '../html/components/spinner/spinner.tpl.html'
        }
    });