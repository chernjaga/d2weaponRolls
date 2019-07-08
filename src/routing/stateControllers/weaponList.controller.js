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
    
    filterService.getFilteredItems(function(filteredObject) {
        vm.list = filteredObject.items;
        vm.categoryHeaders = filteredObject.sections;
        vm.isLoaded = !!vm.list.length;
    }, filters);


    function getRarityClass(hash) {

        return rarityMap[hash];
    };
}]);