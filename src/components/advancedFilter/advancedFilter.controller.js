angular.module('d2RollsApp').controller('advancedFilterCtrl', [
    '$stateParams',
    'languageMapService',
    function (
        $stateParams,
        languageMapService
    ) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.text = languageMapService.getDictionary(lang, 'filter').advancedFilter;
        console.log(vm.foundItems);
    }
}]);