angular.module('d2RollsApp').controller('filterButtonCtrl', ['$stateParams', 'languageMapService', function (
    $stateParams,
    languageMapService
) {
    var vm = this;
    var lang = $stateParams.language;
    vm.text = languageMapService.getDictionary(lang, 'filter').button;
    vm.isExpanded = false;
}]);