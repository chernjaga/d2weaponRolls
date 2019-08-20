angular.module('d2RollsApp').controller('weaponListCtrl', [
    '$stateParams',
    'languageMapService',
    'fetchManifestService',
    'filterService',
    function(
        $stateParams,
        languageMapService,
        fetchManifestService,
        filterService
    )
{
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var filters = $stateParams.filters;
    var sortBy = $stateParams.sortBy

    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isFilterActive = false;
    vm.categoryHeaders;

    switch (sortBy) {
        case 'source': vm.sorting = 'subSource';
            break;
        case 'season': vm.sorting = 'class';
            break;
        default: vm.sorting = 'class';
    }
    
    fetchManifestService.getHashToName(function(initialHashes) { 
        filterService.getFilteredItems(function(filteredItems, sortByArray) {
            vm.categoryHeaders = sortByArray;
            vm.list = filteredItems;
        }, filters, true, vm.sorting);
    }, lang);

    function getRarityClass(hash) {
        return rarityMap[hash];
    };
}]);