angular
.module('d2RollsApp')
.controller('categoriesCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', function(
    $stateParams,
    fetchManifestService,
    languageMapService
) {
    var vm = this;
    var sortingType = $stateParams.sortBy;
    var lang = $stateParams.language;

    vm.isLoaded = false;
    vm.categories = [];
    vm.lang = lang;
    vm.sortingType = sortingType;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {};
        var categoriesArray = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (!sortObject[itemObject[sortingType].name]) {
                sortObject[itemObject[sortingType].name] = true;
                categoriesArray.push(itemObject[sortingType].name);
            }
        };
        vm.categories = categoriesArray;
        vm.isLoaded = !!vm.categories.length;
    });
}]);