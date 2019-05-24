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
            },
            interfaces: {
                perksPanel: {
                    header: 'Перки оружия',
                    expand: 'Показать все варианты',
                    collapse: 'Скрыть'
                }
            },
            home: {
                sortByWeaponClass: 'Сортировать по классу оружия',
                sortByRarity: 'Сортировать по редкости',
                sortBySource: 'Сортировать по источнику получения',
                sortBySeasons: 'Сортировать по сезонам'
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
            },
            interfaces: {
                perksPanel: {
                    header: 'Weapon perks',
                    expand: 'All perks',
                    collapse: 'Hide'
                }
            },
            home: {
                sortByWeaponClass: 'Sort by weapon class',
                sortByRarity: 'Sort by rarity',
                sortBySource: 'Sort by source',
                sortBySeasons: 'Sort by seasons'
            }
        }
    };

    var categoryToReturn;

    function getDictionary(lang, section) {
        if (section) {
            return searchForSection(dictionary[lang], section);
        }
        
        return dictionary[lang];
       
    };

    function searchForSection(target, section) {
        for (var property in target) {
            if (property === section) {
                categoryToReturn = target[property];
                break;
            } else if (typeof target[property] === 'object') {
                searchForSection(target[property], section);
            }
        };

        return categoryToReturn;
    };

    return {
        getDictionary: getDictionary
    };
}]);