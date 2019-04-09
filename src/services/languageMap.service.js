angular.module('d2RollsApp').factory('languageMapService', [ function() {
    var dictionary = {};
    var vocabulary = {
                        search: {
                            ru: 'Поиск',
                            en: 'Search'
                        }
                    };

    function getDictionary (lang) {

        if (dictionary[lang] && dictionary[lang].length) {

            return dictionary;
        }
        for (let word in vocabulary) {
            dictionary[lang] = {};
            dictionary[lang][word] = vocabulary[word][lang];    
        }

        return dictionary;
    }
    return {
        getDictionary: getDictionary
    }
}]);