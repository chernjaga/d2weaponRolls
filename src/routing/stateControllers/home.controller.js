angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    styleHandler
) {
    var vm = this;
    var lang = $stateParams.language;
    var homeText = languageMapService.getDictionary(lang, 'home');

    vm.lang = lang;

    styleHandler.setContentHeight();
    vm.textSortAll = homeText.all;
    vm.sort = {
        rarity: homeText.sortByRarity,
        class: homeText.sortByWeaponClass,
        source: homeText.sortBySource,
        season: homeText.sortBySeasons
    } 

    fetchManifestService.getWeaponList(lang, function(){});
}]);