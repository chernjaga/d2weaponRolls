angular.module('d2RollsApp')
    .filter('seasons', function ($stateParams, languageMapService) {
        var lang = $stateParams.language || 'en';
        var seasons = languageMapService.getDictionary(lang).seasons;
        return function(seasonNumber) {
            return seasons[seasonNumber];
        };
    });