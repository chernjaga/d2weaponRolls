angular.module('d2RollsApp').factory('languageMapService', [ function() {
    var dictionary = {
        ru: {
            search: 'Поиск',
            filter: {
                button: 'Фильтр',
                class: 'Класс оружия',
                slot: 'Слот оружия',
                ammoType: 'Тип патронов',
                damageType: 'Тип урона',
                rarity: 'Редкость',
                frame: 'Рама',
                season: 'Сезон',
                perks: 'Перки',
                cancel: 'Отменить',
                apply: 'Применить'
            },
            sorting: {
                weaponRarity: {
                    exotic: 'Экзотический',
                    legendary: 'Легендарный',
                    rare: 'Редкий',
                    uncommon: 'Необычный',
                    common: 'Обычный'
                }
            },
            interfaces: {
                perksPanel: {
                    header: 'Перки оружия',
                    expand: 'Показать все варианты',
                    collapse: 'Скрыть'
                },
                statsPanel: {
                    header: 'Характеристики оружия'
                }
            },
            home: {
                newStuff: 'НОВОЕ',
                sources: 'АКТИВНОСТИ',
                godRoll: 'ГОД РОЛЛ'
            },
            footerMenu: {
                home: 'Домашняя',
                weapon: 'Арсенал',
                settings: 'Настройки'
            }
        },
        en: {
            search: 'Search',
            filter: {
                button: 'Filter',
                class: 'Weapon class',
                ammoType: 'Ammo type',
                season: 'Season',
                slot: 'Weapon slot',
                damageType: 'Damage type',
                rarity: 'Rarity',
                frame: 'Frame',
                perks: 'Perks',
                cancel: 'Cancel',
                apply: 'Apply'

            },
            sorting: {
                weaponRarity: {
                    exotic: 'Exotic',
                    legendary: 'Legendary',
                    rare: 'Rare',
                    uncommon: 'Uncommon',
                    common: 'Common'
                },
                weaponClasses: {
                    traceRifles: 'Trace Rifles',
                    pulseRifle: 'Pulse Rifle',
                    scoutRifle: 'Scout Rifle',
                    autoRifle: 'Auto Rifle'
                } 
            },
            interfaces: {
                perksPanel: {
                    header: 'Weapon perks',
                    expand: 'All perks',
                    collapse: 'Hide'
                },
                statsPanel: {
                    header: 'Weapon stats'
                }
            },
            home: {
                newStuff: 'NEW STUFF',
                sources: 'WEAPON SOURCES',
                godRoll: 'GOD ROLL'
            },
            footerMenu: {
                home: 'Home',
                weapon: 'Weapon',
                settings: 'Settings'
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