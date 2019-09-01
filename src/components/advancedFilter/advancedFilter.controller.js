angular.module('d2RollsApp').controller('advancedFilterCtrl', [
    '$stateParams',
    'fetchManifestService',
    'languageMapService',
    function (
        $stateParams,
        fetchManifestService,
        languageMapService
    ) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.text = languageMapService.getDictionary(lang, 'filter').advancedFilter;
        // console.log(vm.foundItems);
        // for (var hash in vm.foundItems) {
        //     fetchManifestService.getPerksForSingleWeapon(vm.foundItems, hash)
        // }
    }
}]);