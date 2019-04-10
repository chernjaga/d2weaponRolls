angular.module('d2RollsApp').factory('languageMapService', [ function() {
    var dictionary = {
        ru: {
            search: 'Поиск',
            weaponRarity: {
                exotic: 'Экзотическое',
                legendary: 'Легендарное',
                rare: 'Редкое',
                uncommon: 'Необычное',
                common: 'Обычное'
            }
        },
        en: {
            search: 'Search',
             weaponRarity: {
                exotic: 'Exotic',
                legendary: 'Legendary',
                rare: 'Rare',
                uncommon: 'Uncommon',
                common: 'Common'
            }
        }
    }

    function getDictionary (lang, sectionPath) {
        try {
            if (sectionPath) {

                return dictionary[lang][sectionPath];
            }
            
            return dictionary[lang];
        } catch (err) {
            console.log('Error in dictionary: ' + err.message);
        }
       
    }

    return {
        getDictionary: getDictionary
    }
}]);