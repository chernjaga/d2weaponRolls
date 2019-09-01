angular.module('d2RollsApp').controller('weaponFilterCtrl', [
    '$q',
    '$state',
    '$stateParams',
    'filterService',
    'languageMapService',
    'fetchManifestService',
    'styleHandler',
    function (
        $q,
        $state,
        $stateParams,
        filterService,
        languageMapService,
        fetchManifestService,
        styleHandler
    ) {
    var vm = this;
    var lang = $stateParams.language;
    var includedFilters = [];
    var filterInit = $q.defer();
    var sectionCounter = {};
    var sortBy = 'class';
    
    vm.moveToList = moveToList;
    vm.itemsDetected;
    vm.includedItems = {};
    styleHandler.setContentHeight('filter')
    filterService.resetFilters();
    fetchManifestService.getHashToName(function(initialHashes) {
        vm.hashToName = initialHashes;
        filterInit.resolve();
    }, lang);

    $q.when(filterInit.promise).then(function(){
        init();
    });
    
    function init() {
        vm.text = languageMapService.getDictionary(lang, 'filter');
        filterService.getFilteredItems(function(data) {
            vm.itemsDetected = data.length;
        }, [], true);
        vm.toggleFilter = function(target, filterBy, hash) {   
            var filterItem = `${filterBy}:${hash}`;
            if (!includedFilters.includes(filterItem)) {
                includedFilters.push(filterItem);
            } else {
                includedFilters = removeFromFilters(includedFilters, filterItem);
            }
            
            setIncludedNumber(target, filterBy, hash);

            target.isIncluded = !target.isIncluded;
            filterService.getFilteredItems(function(data) {
                vm.itemsDetected = data.length;
            }, includedFilters, true);
        };
    }

    function setIncludedNumber(target, filterBy, hash) {
        if (!sectionCounter[filterBy]) {
            sectionCounter[filterBy] = {};
        }
        if (!sectionCounter[filterBy][hash]) {
           sectionCounter[filterBy][hash] = true;
        } else {
            delete  sectionCounter[filterBy][hash];
        }
        vm.includedItems[filterBy] = Object.keys(sectionCounter[filterBy]).length;
    };

    function removeFromFilters(filtersArray, item) {
        return filtersArray.filter(function(element){
            return element != item;
        }); 
    }

    function moveToList() {
        sortBy = filterService.getSortParam();
        $state.go('weaponList', {
            language: lang,
            sortBy: sortBy,
            filters: includedFilters
        });
    }
}]);