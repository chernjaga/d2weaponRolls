angular
.module('d2RollsApp')
.controller('categoriesCtrl', ['$stateParams', 'fetchManifestService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    styleHandler
) {
    var vm = this;
    var sortingType = $stateParams.sortBy;
    var lang = $stateParams.language;

    styleHandler.setContentHeight('category');
    vm.categories;
    vm.lang = lang;
    vm.sortingType = sortingType;
    
    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {};
        var categoriesArray = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            try {
                if (!sortObject[itemObject[sortingType].name]) {
                    sortObject[itemObject[sortingType].name] = true;
                    categoriesArray.push(itemObject[sortingType].name);
                }

            } catch (e) {
                    
            };
        };
        vm.categories = categoriesArray;
    });
}]);