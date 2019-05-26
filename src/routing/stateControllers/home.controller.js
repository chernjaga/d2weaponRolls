angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', function(
    $stateParams,
    fetchManifestService,
    languageMapService
) {
    var vm = this;
    var lang = $stateParams.language;
    var homeText = languageMapService.getDictionary(lang, 'home');
    var footer = document.getElementsByClassName('footer-menu')[0];
    var bodyHeight = footer.getBoundingClientRect().bottom;
    var footerHeight = getComputedStyle(footer).height.replace('px', '');
    var menuHeight = bodyHeight - footerHeight
    var homeMenu = document.getElementsByClassName('home-sorting-menu')[0];
    homeMenu.style.height = menuHeight - 32 + 'px';
    vm.sort = {
        rarity: homeText.sortByRarity,
        class: homeText.sortByWeaponClass,
        source: homeText.sortBySource,
        season: homeText.sortBySeasons
    } 

    fetchManifestService.getWeaponList(lang, function(){});
}]);