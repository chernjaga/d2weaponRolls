angular.module('d2RollsApp').controller('weaponFilterCtrl', [
    '$q',
    '$state',
    '$stateParams',
    'filterService',
    'languageMapService',
    'fetchManifestService',
    function (
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

    vm.includedItems = {};
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
        vm.toggleFilter = function(target, filterBy, hash) {
            
            setIncludedNumber(target, filterBy, hash);
            target.isIncluded = !target.isIncluded;
            // console.log(filterBy, + ':' + hash);
            // console.log(target);
        };
    };

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
}]);