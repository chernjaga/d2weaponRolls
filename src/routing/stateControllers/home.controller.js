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
            text: text.newStuff
        },
        {
            sortBy: 'source',
            text: text.sources
        },
        {
            sortBy: 'godRoll',
            text: text.godRoll
        }
    ];
    vm.lang = lang;
    styleHandler.setContentHeight();

    fetchManifestService.getWeaponList(lang, function(){});
}]);