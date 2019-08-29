angular
.module('d2RollsApp')
.controller('categoriesCtrl', ['$stateParams', 'fetchManifestService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    styleHandler
) {
    styleHandler.setContentHeight();
    var vm = this;
    var sortingType = $stateParams.sortBy;
    var lang = $stateParams.language;

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
                    sortObject[itemObject[sortingType].name] = itemObject[sortingType].sectionHash || itemObject[sortingType].name;
                    categoriesArray.push(itemObject[sortingType].name);
                }

            } catch (e) {
                    
            };
        };
        console.log(categoriesArray);
        
        vm.hashObj = sortObject;
        vm.categories = categoriesArray;
    });
}]);