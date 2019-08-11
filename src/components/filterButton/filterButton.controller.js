angular.module('d2RollsApp').controller('filterButtonCtrl', ['$stateParams', 'languageMapService', function (
    $stateParams,
    languageMapService
) {
    var vm = this;
    var lang = $stateParams.language;
    vm.lang = lang;
    vm.text = languageMapService.getDictionary(lang, 'filter').button;
}]);