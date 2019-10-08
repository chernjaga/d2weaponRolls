angular.module('d2RollsApp')
    .filter('perks', function ($stateParams, languageMapService) {
        var lang = $stateParams.language || 'en';
        var perks = languageMapService.getDictionary(lang).filter.advancedFilter;
        return function(name) {
            return perks[name];
        };
    });