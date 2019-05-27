angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'varsStore', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    varsStore
) {
    var vm = this;
    var lang = $stateParams.language;
    var homeText = languageMapService.getDictionary(lang, 'home');

    varsStore.setContentHeight();
    vm.textSortAll = homeText.all;
    vm.sort = {
        rarity: homeText.sortByRarity,
        class: homeText.sortByWeaponClass,
        source: homeText.sortBySource,
        season: homeText.sortBySeasons
    } 

    fetchManifestService.getWeaponList(lang, function(){});
}]);