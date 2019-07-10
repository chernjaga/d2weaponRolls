angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService', 'filterService', function(
    $stateParams,
    languageMapService,
    fetchManifestService,
    filterService
){
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var filters = $stateParams.filters;
    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;
    vm.isFilterActive = false;
    vm.categoryHeaders;
    fetchManifestService.getHashToName(function(initialHashes) {
        vm.categoryHeaders = filterService.setSortTypeHeaders(initialHashes);
        filterService.getFilteredItems(function(filteredItems) {
            console.log(filteredItems);
            vm.list = filteredItems;
            vm.isLoaded = !!vm.list.length;
        }, filters);
    }, lang);

    function getRarityClass(hash) {
        return rarityMap[hash];
    };
}]);