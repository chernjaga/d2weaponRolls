angular.module('d2RollsApp')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: function($scope, $timeout, $rootScope) {
                $rootScope.$on('$locationChangeStart', function() { 
                    $scope.isLoading = true;
                });
                $rootScope.$on('changeStateStart', function() { 
                    $scope.isLoading = true;
                });
                $rootScope.$on('$viewContentLoaded', function() {
                    $timeout(function() {
                        $scope.isLoading = false;
                    });
                }, 1200);
            },
            templateUrl: '../html/components/spinner/spinner.tpl.html'
        }
    });