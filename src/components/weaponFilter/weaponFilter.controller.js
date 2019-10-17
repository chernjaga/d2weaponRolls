angular.module('d2RollsApp').controller('weaponFilterCtrl', [
    '$rootScope',
    '$scope',
    '$q',
    '$state',
    '$stateParams',
    'filterService',
    'languageMapService',
    'fetchManifestService',
    function (
        $rootScope,
        $scope,
        $q,
        $state,
        $stateParams,
        filterService,
        languageMapService,
        fetchManifestService
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
    vm.resetFilter = resetFilter;

    filterService.resetFilters();
    fetchManifestService.getHashToName(function(initialHashes) {
        vm.hashToName = initialHashes;
        filterInit.resolve();
    }, lang);

    $q.when(filterInit.promise).then(function(){
        init();
    });
    
    $rootScope.$on('changeStateFinish', function() {
        vm.lastRendered = true;
    });

    function init() {
        vm.text = languageMapService.getDictionary(lang, 'filter');
        filterService.getFilteredItems(function(data) {
            vm.searchResults = data;
            vm.itemsDetected = data.length;
        }, [], true);
        vm.toggleFilter = function(target, filterBy, hash, isPerksSections) {
            var filterItem = `${filterBy}:${hash}`; 
            if (!includedFilters.includes(filterItem)) {
                includedFilters.push(filterItem);
            } else {
                includedFilters = removeFromFilters(includedFilters, filterItem);
            }
            if (!isPerksSections && filterBy === 'class') {
                cleanPerksFilter(includedFilters);
            }
            setIncludedNumber(target, filterBy, hash);

            target.isIncluded = !target.isIncluded;
            filterService.getFilteredItems(function(data) {
                vm.searchResults = data;
                vm.itemsDetected = data.length;
                if (data.length !== 0) {
                    $scope.$broadcast('refresh', {items: vm.searchResults, refresh: !isPerksSections});
                }
            }, includedFilters, true);
        };
    }

    function cleanPerksFilter(filters) {
        filters.forEach(function(item, index) {
            if (item.includes('frame') ||
                item.includes('weaponStatPerk1') ||
                item.includes('weaponStatPerk2') ||
                item.includes('additionalPerk1') ||
                item.includes('additionalPerk2')
            ) {
                filters.splice(index, 1);
            }
        })
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
    }

    function resetFilter() {
        $state.reload();
    }

    function removeFromFilters(filtersArray, item) {
        return filtersArray.filter(function(element){
            return element != item;
        }); 
    }

    function moveToList(isAllowed) {
        if (isAllowed) {
            sortBy = filterService.getSortParam();
            $state.go('weaponList', {
                language: lang,
                sortBy: sortBy,
                filters: includedFilters
            });
        }
    }
}]);