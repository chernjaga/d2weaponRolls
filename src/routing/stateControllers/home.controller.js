angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    styleHandler
) {
    var vm = this;
    var lang = $stateParams.language;
    var text = languageMapService.getDictionary(lang, 'home');
    vm.sorting = [
        {
            sortBy: 'season',
            toState: 'categories',
            text: text.newStuff
        },
        {
            sortBy: 'source',
            toState: 'categories',
            text: text.sources
        },
        {
            sortBy: 'godRoll',
            toState: 'filterState',
            text: text.godRoll
        }
    ];
    vm.lang = lang;
    styleHandler.setContentHeight();

    fetchManifestService.getWeaponList(lang, function(){});
}]);