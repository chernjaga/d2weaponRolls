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
                apply: 'Применить',
                source: 'Активность',
                selected: 'Выбрано',
                advanced: 'Поиск по перкам',
                advancedFilter: {
                    frame: 'Рама'
                }
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
            },
            seasons: {
                1: 'Destiny 2',
                2: 'Course of Osiris',
                3: 'Warmind',
                4: 'Forsaken',
                5: 'The Black Armory',
                6: 'Joker\'\s Wild',
                7: 'Opulence' 
            },
        },
        en: {
            seasons: {
                1: 'Destiny 2',
                2: 'Course of Osiris',
                3: 'Warmind',
                4: 'Forsaken',
                5: 'The Black Armory',
                6: 'Joker\'\s Wild',
                7: 'Opulence' 
            },
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
                apply: 'Apply',
                source: 'Activity',
                selected: 'Selected',
                advanced: 'Search by perks',
                advancedFilter: {
                    frame: 'Frame'
                }
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
    }

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
    }
    
    return {
        getDictionary: getDictionary
    };
}]);