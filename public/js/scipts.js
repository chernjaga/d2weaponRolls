angular.module('d2RollsApp', ['ui.router', 'ngAnimate'])
.config(function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider
) {
    var weaponListState = {
        name: 'weaponList',
        url: '/weaponList/{language}?sortBy&categories&filters',
        params: {
            language: 'en',
            sortBy: '',
            filters: []
        },
        templateUrl: '../html/routing/stateTemplates/weaponList.tpl.html',
        controller: 'weaponListCtrl',
        controllerAs: 'weapons'
    };

    var weaponViewState = {
        name: 'weaponView',
        url: '/weaponView/{language}/{weaponHash}?roll',
        params: {
            language: 'en',
            roll: []
        },
        reloadOnSearch : false,
        templateUrl: '../html/routing/stateTemplates/weaponView.tpl.html',
        controller: 'weaponViewCtrl',
        controllerAs: 'weapon'
    };

    var homeState = {
        name: 'home',
        url: '/home/{language}',
        params: {
            language: 'en'
        },
        controller: 'homeCtrl',
        controllerAs: 'home',
        templateUrl: '../html/routing/stateTemplates/home.tpl.html',
    };

    var categories = {
        name: 'categories',
        url: '/categories/{language}?sortBy',
        params: {
            language: 'en',
            sortBy: 'class'
        },
        controller: 'categoriesCtrl as sorting',
        templateUrl: '../html/routing/stateTemplates/categories.tpl.html'
    };

    var filterState = {
        name: 'filterState',
        url: '/filter/{language}',
        params: {
            language: 'en',
            filters: []
        },
        controller: 'weaponFilterCtrl as filter',
        templateUrl: '../html/routing/stateTemplates/filterState.tpl.html'
    }

    $stateProvider.state(homeState);
    $stateProvider.state(categories);
    $stateProvider.state(weaponListState);
    $stateProvider.state(weaponViewState);
    $stateProvider.state(filterState);
    $urlRouterProvider.otherwise('/home/en');
    $locationProvider.html5Mode(true);
});
angular.module('d2RollsApp').factory('fetchManifestService', ['$http', '$q', function($http, $q) {
    var weaponListObject = [];
    var perksBucket = {};
    var lastLanguage;
    var weaponData = {};
    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    };

    var dataDownloadDeferred = $q.defer();
    var filterHashesDeferred = $q.defer();
    var perksDownloadDeferred = $q.defer();
    var hashToName = {
        class: {},
        rarity: {},
        slot: {},
        season: {},
        ammoType: {},
        source: {},
        subSource: {},
        frame: {},
        damageType: {}
    };

    function getWeaponList (language, callback) {
        if (Object.keys(weaponListObject).length && lastLanguage === language && callback) {
            callback(weaponListObject);

            return;
        }
        var weaponListPromise = $q(function(resolve) {
            resolve($http.post('/getWeaponList', JSON.stringify({language: language})).then(function(response) {
                weaponListObject = response.data;
                if (callback) {
                    callback(weaponListObject);
                }
                return weaponListObject;
            }));
        });

        var weaponDataPromise = $q(function(resolve){
            resolve($http.post('/getWeaponData', JSON.stringify({language: language})).then(function(response) {
                weaponData = response.data;
                if (callback) {
                    callback(weaponListObject);
                }

                dataDownloadDeferred.resolve();;
            }));
        });

        var weaponPerksPromise = $q(function(resolve) {
            resolve($http.post('/getWeaponPerks', JSON.stringify({language: language})).then(function(response) {
                perksBucket = response.data;
                perksDownloadDeferred.resolve(perksBucket);
            }));
        });

        lastLanguage = language;

        $q.all([
            weaponListPromise,
            weaponDataPromise,
            weaponPerksPromise
        ]).then(function(responses) {
            var items = responses[0];
            for (var hash in items) {
                
                if (!hashToName.class[items[hash].class.hash]) {
                    hashToName.class[items[hash].class.hash] = items[hash].class.name;
                }
                if (!hashToName.slot[items[hash].slot.hash]) {
                    hashToName.slot[items[hash].slot.hash] = items[hash].slot.name;
                }
                if (!hashToName.rarity[items[hash].rarity.hash]) {
                    hashToName.rarity[items[hash].rarity.hash] = items[hash].rarity.name;
                }
                if (!hashToName.season[items[hash].season.hash]) {
                    hashToName.season[items[hash].season.name] = items[hash].season.name;
                }
                if (!hashToName.source[items[hash].source.sectionHash] && items[hash].source.sectionHash) {
                    hashToName.source[items[hash].source.sectionHash] = items[hash].source.name;
                }
                if (!hashToName.subSource[items[hash].subSource.name] && items[hash].subSource.name) {
                    hashToName.subSource[items[hash].subSource.name] = items[hash].subSource.name;
                }
                if (!hashToName.damageType[items[hash].damageType.hash]) {
                    hashToName.damageType[items[hash].damageType.hash] = items[hash].damageType.name;
                }
                if (!hashToName.ammoType[items[hash].ammoType.hash]) {
                    hashToName.ammoType[items[hash].ammoType.hash] = items[hash].ammoType.name;
                }
                if (!hashToName.frame[items[hash].frame.hash]) {
                    hashToName.frame[items[hash].frame.hash] = items[hash].frame.name;
                }
            }
            filterHashesDeferred.resolve();
        }).catch(function(error) {
            console.log(error);
        });
    };
    function getHashToName(callback, language) {
        if (Object.keys(weaponListObject).length && lastLanguage === language && callback) {
            callback(hashToName);
            return;
        }
        $q.when(filterHashesDeferred.promise).then(function() {
            callback(hashToName);
        });
    };
    
    function getSingleWeaponData (language, hash, listCallback, dataCallback, singleDataCallback) {
        if (
            Object.keys(weaponListObject).length && 
            Object.keys(weaponData).length && 
            lastLanguage === language && 
            listCallback && dataCallback
        ) {

            listCallback(weaponListObject[hash]);
            dataCallback(weaponData[hash]);

            return;
        }

        if (
            Object.keys(weaponListObject).length && 
            !Object.keys(weaponData).length && 
            lastLanguage === language && 
            listCallback && dataCallback
        ) {
            listCallback(weaponListObject[hash]);
            $q.when(dataDownloadDeferred.promise).then(function() {
                dataCallback(weaponData[hash]);
            });

            return;
        }

        lastLanguage = language;

        $q.when(
            $http.post('/getSingleWeapon', JSON.stringify({language: language, hash: hash}))
        ).then(function(response) {
            if (singleDataCallback) {
                singleDataCallback(response.data);
            }
        }).then(function(){
            getWeaponList(language);
        }).catch(function(error) {
            console.log(error);
        });
    };

    function getPerksForSingleWeapon(bucket, perksPanelCallback) {
        var bucketToReturn = [];
    
        if (!!Object.keys(perksBucket).length) {
            perksPanelCallback(mapPerksName());
            return ;
        }

        $q.when(perksDownloadDeferred.promise).then(function() {
            perksPanelCallback(mapPerksName());
        });

        function mapPerksName() {
            for (var perk of bucket) {
                var objectToPush = {};
                objectToPush.vendorPerk = perksBucket[perk.vendorPerk];
                if (perk.randomizedPerks.length) {
                    var randomizedPerks = [];
                    for (var randomPerk of perk.randomizedPerks) {
                        randomizedPerks.push(perksBucket[randomPerk])
                    }
                    objectToPush.randomizedPerks = randomizedPerks;
                }
                bucketToReturn.push(objectToPush);
            }
            
            return bucketToReturn;
        }
    }

    return {
        getPerksForSingleWeapon: getPerksForSingleWeapon,
        getSingleWeaponData: getSingleWeaponData,
        getWeaponList: getWeaponList,
        rarityMap: rarityMap,
        getHashToName: getHashToName,
        weaponData: weaponData
    };
}]);
angular.module('d2RollsApp').factory('filterService', ['$q', '$stateParams', 'fetchManifestService', function($q, $stateParams, fetchManifestService) {
    var itemsObject = {};
    var applyDefer = $q.defer();
    var filteredItems = [];
    var fetchItems = new Promise(function(resolve){
        fetchManifestService.getWeaponList($stateParams.language, function(items){
            itemsObject = items;
            resolve(items);
        });
    });
    var sortByObject = {};
    var sortByParam = 'class';

    //todo: language dependency

    function getFilteredItems(callback, filters, isFilterState, sortBy) {
        if (!sortBy) {
            if (isFilterState) {
                sortBy = setSortBy(filters);
            }  else {
                sortBy = 'class';
            }
        }
        if (filteredItems.length && !isFilterState) {
            callback(filteredItems, sortByObject);
            return;
        }
        if (!Object.keys(itemsObject).length) {
            fetchItems.then(function(){
                callback(applyFilter(filters, itemsObject, sortBy), sortByObject);
            });
            return;
        }
        callback(applyFilter(filters, itemsObject, sortBy), sortByObject);
    }

    function setSortBy(filters) {
        var filterMap = initFiltersMap(filters);
        if (filterMap.season && !filterMap.source) {
            sortByParam = 'season';
            return 'season';
        }
        if (!filterMap.season && filterMap.source) {
            sortByParam = 'subSource';
            return 'subSource';
        }
        if (!filterMap.season && !filterMap.source) {
            if (filterMap.class && filterMap.class.length === 1) {
                sortByParam = 'frame';
                return 'frame';
            }
        }
        sortByParam = 'class';
        return 'class';
    }

    function applyFilter(inputFilters, objToFilter, sort) {
        sortByObject = {};
        var filtersMap = initFiltersMap(inputFilters);
        var outputArray = [];
        if (filtersMap.class) {
            filtersMap.class.forEach(function(filterValue) {
                outputArray = outputArray.concat(applyFilterPart(objToFilter, filtersMap, filterValue, sort));
            });
        } else {
            outputArray = applyFilterPart(objToFilter, filtersMap, null , sort);
        }
        filteredItems = outputArray;
        applyDefer.resolve();
        return outputArray;
    }

    function applyFilterPart(objToFilter, filters, weaponClass, sort) {
        var outputPart = [];
        for (var hash in objToFilter) {
            var item = objToFilter[hash];
            var isApplied = true;
            if (Object.keys(filters).length === 1 && filters.class) {
                isApplied = item.class.name === weaponClass
            } else {
                for (var valuesName in filters) {
                    var filterValueArray = filters[valuesName];
                    
                    if (valuesName !== 'class') {
                        item[valuesName].name = item[valuesName].name.toString();
                        if (weaponClass) {
                            isApplied = isApplied && filterValueArray.includes(item[valuesName].name) && item.class.name === weaponClass;
                        } else {
                            if (valuesName === 'source' && item.source.bindTo) {
                                isApplied = isApplied && filterValueArray.includes(item.source.bindTo) ||
                                    filterValueArray.includes(item.source.bindTo1) ||
                                    filterValueArray.includes(item.source.name);
                            } else {
                                isApplied = isApplied && filterValueArray.includes(item[valuesName].name);
                            }
                        }
                    } else if (valuesName === 'class') {
                        isApplied = isApplied && filterValueArray.includes(weaponClass);
                    } else {
                        isApplied = false;
                    }
                };
            }
            if (isApplied) {
                outputPart.push(item);
                if (sort && !sortByObject[item[sort].name]) {
                    sortByObject[item[sort].name] = true;
                }
            }
        }
        return outputPart;
    }

    function initFiltersMap(filters) {
        if (typeof filters === 'string') {
            filters = [filters];
        }
        var map = {};
        filters.forEach(function(filter) {
            var key = filter.split(':')[0];
            var value = filter.split(':')[1];
            if (!map[key]) {
                map[key] = [value];
            } else {
                map[key].push(value)
            }
        });
        return map;
    }

    function resetFilters() {
        filteredItems = {};
    }

    function getSortParam() {
        return sortByParam;
    }

    return {
        getFilteredItems: getFilteredItems,
        getSortParam: getSortParam,
        resetFilters: resetFilters
    };
}]);
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
                7: 'opulence' 
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
angular.module('d2RollsApp').factory('utils', ['$q', function($q) {
    var statsStoreObject = {};
    var recalculatedStats = {};
    var statInit = $q.defer();
    var recalculateDeffer = $q.defer();
    var filterMap = {
        '4043523819': {
            order: 1
        }, //impact
        '3614673599': {
            order: 1.1
        }, //blastRadius
        '1240592695': {
            order: 2
        }, //range
        '2523465841': {
            order: 2.1
        }, //velocity
        '15562408': {
            order: 3
        }, //stability
        '155624089': {
            order: 3.1
        }, // GL stability
        '943549884': {
            order: 4
        }, //handling
        '4188031367': {
            order: 5
        }, //reload speed
        '4284893193': {
            order: 6
        }, // RPM
        '2961396640': {
            order: 6.1
        }, // Charge time
        '447667954': {
            order: 6.2
        }, // Draw time
        '3871231066': {
            order: 7
        }, //magazine
        '1345609583': {
            order: 8
        }, //aim assist
        '1591432999': {
            order: 9
        }, //accuracy
        '3555269338': {
            order: 10
        }, //zoom
        
    };

    function statsFilter (stats) {
        var output = [];
        angular.forEach(stats, function(value, key) {
            if (filterMap[key] && statsStoreObject[key]){
                value.order = filterMap[key].order;
                value.startPosition = statsStoreObject[key].statValue;
                output.push(value);
            }
        });
        return output;
    }

    function initWeaponStats(stats) {
            statsStoreObject = JSON.parse(JSON.stringify(stats));
            statInit.resolve(stats);        
    }

    function collectStats(investmentStats) {
        if (Object.keys(statsStoreObject).length) {
            recalculateStats(investmentStats);
            return;
        }
        $q.when(statInit.promise).then(function() {
            recalculateStats(investmentStats);
        });
    }

    function recalculateStats(newStats) {
        recalculatedStats = JSON.parse(JSON.stringify(statsStoreObject));
        for (item of newStats) {
            var hash = item.statTypeHash;
            if (recalculatedStats[hash]) {
                recalculatedStats[hash].statValue = statsStoreObject[hash].statValue + item.value;
            }
        }
        
        recalculateDeffer.resolve(recalculatedStats);
    }

    function getNewStats(callback) {
        $q.when(recalculateDeffer.promise).then(function() {
            var output = statsFilter(recalculatedStats);
            callback(output);
        });
    }

    return {
        collectStats: collectStats,
        initWeaponStats: initWeaponStats,
        getNewStats: getNewStats
    };
}]);
angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight(stateCorrectionValue) {
        var view = document.getElementsByClassName('view')[0];

        stateCorrectionValue = stateCorrectionValue || 0
        if (contentHeight) {
            view.style.height = contentHeight;
            return;
        }
        var footer = document.getElementsByClassName('footer-panel')[0];
        var bodyHeight = footer.getBoundingClientRect().top;

        view.style.height = bodyHeight - 16 - stateCorrectionValue + 'px';
        contentHeight = view.clientHeight + 'px';
        console.log(contentHeight);
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
angular.module('d2RollsApp')
    .filter('seasons', function ($stateParams, languageMapService) {
        var lang = $stateParams.language;
        var seasons = languageMapService.getDictionary(lang).seasons;
        return function(seasonNumber) {
            return seasons[seasonNumber];
        };
    });
angular.module('d2RollsApp').controller('advancedFilterCtrl', [
    '$stateParams',
    'fetchManifestService',
    'languageMapService',
    function (
        $stateParams,
        fetchManifestService,
        languageMapService
    ) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.text = languageMapService.getDictionary(lang, 'filter').advancedFilter;
        // console.log(vm.foundItems);
        // for (var hash in vm.foundItems) {
        //     fetchManifestService.getPerksForSingleWeapon(vm.foundItems, hash)
        // }
    }
}]);
angular.module('d2RollsApp')
    .directive('advancedFilter', function () {
        return {
            restrict: 'E',
            replace: false,
            bindToController: {
                foundItems: '<'
            },
            controller: 'advancedFilterCtrl as advancedFilter',
            templateUrl: '../html/components/advancedFilter/advancedFilter.tpl.html'
        }
    });
angular.module('d2RollsApp')
    .directive('customComponentTemplate', function () {
        return {
            replace: false,
            restrict: 'E',
            scope: {
                myText: '<'
            },
            templateUrl: '../html/components/customComponentTemplate/customComponentTemplate.tpl.html'
        }
    });
angular.module('d2RollsApp').controller('filterButtonCtrl', ['$stateParams', 'languageMapService', function (
    $stateParams,
    languageMapService
) {
    var vm = this;
    var lang = $stateParams.language;
    vm.lang = lang;
    vm.text = languageMapService.getDictionary(lang, 'filter').button;
}]);
angular.module('d2RollsApp')
    .directive('filterButton', function () {
        return {
            restrict: 'E',
            replace: true,
            controller: 'filterButtonCtrl as filterButton',
            templateUrl: '../html/components/filterButton/filterButton.tpl.html'
        }
    });
angular.module('d2RollsApp').controller('footerPanelCtrl', ['$state', '$stateParams', '$transitions', 'languageMapService', function (
    $state,
    $stateParams,
    $transitions,
    languageMapService
    ) {
    var vm = this;
    var lang;
    vm.$onInit = function() {
        lang = $stateParams.language || 'en';
        vm.text = languageMapService.getDictionary(lang, 'footerMenu');
        vm.currentState = $state.current.name;
    }
    $transitions.onSuccess({}, function() {
        vm.currentState = $state.current.name;
    });

}]);
angular.module('d2RollsApp')
    .directive('footerPanel', function ($state) {
        return {
            restrict: 'E',
            replace: false,
            controller: 'footerPanelCtrl',
            controllerAs: 'footer',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html'
        }
    });
angular.module('d2RollsApp')
    .directive('loadingTrigger', function ($rootScope) {
        return {
            restrict: 'A',
            scope: {
                finishOnLast: '<'
            },
            replace: false,
            link: function(scope, element, attr) {
                if (attr.loadingTrigger === 'isFinishState' || scope.finishOnLast) {
                    $rootScope.$emit('changeStateFinish');
                }
                element.on('click', function() {
                    if (attr.loadingTrigger === 'startOnClick') {
                        $rootScope.$emit('changeStateStart');
                    }            
                });
            }
        };
    });
function menuLinkCtrl($state, filterService) {
    var vm = this;
    vm.clickHandler = function() {
        var filters = vm.params.filters;
        if (filters) {
            filterService.resetFilters();
            filterService.getFilteredItems(function(data){
                $state.go(vm.goTo, vm.params);
            }, filters);
        } else {
            $state.go(vm.goTo, vm.params);
        }
    };
}

angular.module('d2RollsApp')
    .directive('menuLink', function () {
        return {
            restrict: 'E',
            replace: true,
            bindToController: {
                linkClass: '<',
                goTo: '<',
                hashData: '<',
                linkText: '<',
                params: '<'
            },
            templateUrl: '../html/components/menuLink/menuLink.tpl.html',
            controller: menuLinkCtrl,
            controllerAs: 'link',
            link: function(scope, element, attr) {
                if (attr.hashData) {
                    element[0].style.backgroundImage = `url("./img/filterAssets/${scope.link.params.sortBy}/${scope.link.hashData}.png")`;
                }
            }
        };
    });
function perksBinderCtrl(){
    var vm = this;
    vm.$onInit = function() {
        vm.bindedPerk.vendorPerk = vm.initPerk;
        vm.collectBinded();
    }
    vm.bindPerk = function(target) {
        vm.bindedPerk.vendorPerk = target.randomPerk;
        return false;
    };
};

angular.module('d2RollsApp')
    .directive('perksBinder', function () {
        return {
            restrict: 'A',
            replace: false,
            bindToController: {
                bindedPerk: '<',
                initPerk: '<',
                collectBinded: '<'
            },
            controller: perksBinderCtrl,
            controllerAs: 'binder'
        }
    });
function spinnerCtrl($timeout, $rootScope) {
    var vm = this;
    vm.isLoading = true;
    $rootScope.$on('changeStateStart', function() {
        vm.isLoading = true;
    });
    $rootScope.$on('changeStateFinish', function() {
        $timeout(function() {
            vm.isLoading = false;
        });
    });
}

angular.module('d2RollsApp')
    .directive('spinner', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: spinnerCtrl,
            controllerAs: 'spinner',
            templateUrl: '../html/components/spinner/spinner.tpl.html'
        }
    });
function scaleCtrl () {};

angular.module('d2RollsApp')
    .directive('statScale', function() {
        return {
            restrict: 'E',
            bindToController: {
                value: '<',
                startPosition: '<'
            },
            controller: scaleCtrl,
            controllerAs: 'scale',
            replace: false,
            templateUrl: '../html/components/statScale/statScale.tpl.html',
            link: function(scope, element, attributes, scale) {
                var negativeDiff = element[0].getElementsByClassName('negative')[0];
                var positiveDiff = element[0].getElementsByClassName('positive')[0];
                var primaryStat = element[0].getElementsByClassName('neutral')[0];
                var primaryValue = scale.startPosition;
                var currentValue = scale.value;
                setTimeout(function(){
                    positiveDiff.style.width = currentValue + '%';
                    negativeDiff.style.maxWidth = primaryValue + '%';
                    negativeDiff.style.width = currentValue + '%';
                    primaryStat.style.width = primaryValue + '%';
                });
            }
        }
    });
function statsRefresherCtrl(utils) {
    var vm = this;
    vm.$onInit = getData;
    vm.refresh = getData;
    function getData (){
        utils.getNewStats(function(data){
            vm.data = data;
        });
    }
}

angular.module('d2RollsApp')
    .directive('statsRefresher', function() {
        return {
            restrict: 'A',
            replace: false,
            controller: statsRefresherCtrl,
            controllerAs: 'refresher'
        }
    });
angular.module('d2RollsApp').controller('statsViewCtrl', [ function ($timeout) {
    
}]);
angular.module('d2RollsApp')
    .directive('statsView', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'statsViewCtrl as stats',
            bindToController: {
                inputStats: '<'
            },
            templateUrl: '../html/components/statsView/statsView.tpl.html'
        };
    });
function statsViewRefresherCtrl($timeout) {
    var vm = this;
    vm.$onInit = function() {
        $timeout(vm.refresh);
    }
}

angular.module('d2RollsApp')
    .directive('statsViewRefresher', function() {
        return {
            restrict: 'A',
            replace: false,
            controller: statsViewRefresherCtrl,
            bindToController: {
                refresh: '<'
            }
        }
    });
angular.module('d2RollsApp')
    .directive('perkTooltip', function () {
        return {
            restrict: 'E',
            replace: false,
            scope:{
                title: '<',
                description: '<'
            },
            templateUrl: '../html/components/tooltip/tooltip.tpl.html',
            link: function(scope, element) {
                element.find('button').on('click', function(event) {
                    element[0].parentElement.classList.remove('has-tooltip');
                });
            } 
        };
    });
angular.module('d2RollsApp').controller('weaponFilterCtrl', [
    '$q',
    '$state',
    '$stateParams',
    'filterService',
    'languageMapService',
    'fetchManifestService',
    function (
        $q,
        $state,
        $stateParams,
        filterService,
        languageMapService,
        fetchManifestService
    ) {
    var vm = this;
    var lang = $stateParams.language;
    var includedFilters = [];
    var filterInit = $q.defer();
    var sectionCounter = {};
    var sortBy = 'class';
    
    vm.moveToList = moveToList;
    vm.itemsDetected;
    vm.isExpandingDisplayed = false;
    vm.includedItems = {};
    filterService.resetFilters();
    fetchManifestService.getHashToName(function(initialHashes) {
        vm.hashToName = initialHashes;
        filterInit.resolve();
    }, lang);

    $q.when(filterInit.promise).then(function(){
        init();
    });
    
    function init() {
        vm.text = languageMapService.getDictionary(lang, 'filter');
        filterService.getFilteredItems(function(data) {
            vm.searchResults = data;
            vm.itemsDetected = data.length;
        }, [], true);
        vm.toggleFilter = function(target, filterBy, hash) {   
            var filterItem = `${filterBy}:${hash}`;
            if (!includedFilters.includes(filterItem)) {
                includedFilters.push(filterItem);
            } else {
                includedFilters = removeFromFilters(includedFilters, filterItem);
            }
            
            setIncludedNumber(target, filterBy, hash);

            target.isIncluded = !target.isIncluded;
            filterService.getFilteredItems(function(data) {
                vm.searchResults = data;
                vm.itemsDetected = data.length;
            }, includedFilters, true);
        };
    }

    function setIncludedNumber(target, filterBy, hash) {
        if (!sectionCounter[filterBy]) {
            sectionCounter[filterBy] = {};
        }
        if (!sectionCounter[filterBy][hash]) {
           sectionCounter[filterBy][hash] = true;
        } else {
            delete  sectionCounter[filterBy][hash];
        }
        vm.includedItems[filterBy] = Object.keys(sectionCounter[filterBy]).length;
    }

    function removeFromFilters(filtersArray, item) {
        return filtersArray.filter(function(element){
            return element != item;
        }); 
    }

    function moveToList() {
        sortBy = filterService.getSortParam();
        $state.go('weaponList', {
            language: lang,
            sortBy: sortBy,
            filters: includedFilters
        });
    }
}]);
angular.module('d2RollsApp')
    .directive('weaponFilter', function() {
        return {
            restrict: 'E',
            replace: false,
            controller: 'weaponFilterCtrl as filter',
            templateUrl: '../html/components/weaponFilter/weaponFilter.tpl.html'
        };
    })
    .directive('backgroundSrc', function() {
        return {
            restrict: 'A',
            replace: false,
            scope: {
                backgroundSection: '<',
                backgroundName: '<',
                gridColumn: '<'
            },
            link: function(scope, element) {
                var isVerticalList = scope.backgroundSection === 'season' || scope.backgroundSection === 'source';
                var isShortList = scope.backgroundSection === 'ammoType' || scope.backgroundSection === 'slot' || scope.backgroundSection === 'damageType';
                element[0].style.backgroundImage = `url('./img/filterAssets/${scope.backgroundSection}/${scope.backgroundName}.png')`;
                element[0].style.backgroundRepeat = 'no-repeat';
                element[0].style.backgroundOrigin = 'content-box';
                if (isVerticalList) {
                    element[0].style.backgroundPosition = 'top';
                } else {
                    element[0].style.backgroundPosition = 'center';
                }
                if (isShortList) {
                    element[0].style.backgroundSize = "40%"
                } else {
                    element[0].style.backgroundSize = 'cover';
                }
                element[0].style.gridColumn = scope.gridColumn;
            }
        };
    })
angular.module('d2RollsApp')
    .directive('weaponListItem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: '<',
                language: '<',
                offset: '@'
            },
            templateUrl: '../html/components/weaponListItem/weaponListItem.tpl.html',
        }
    })
angular.module('d2RollsApp').controller('weaponPerksPanelCtrl', ['$location', '$stateParams','utils', function ($location, $stateParams, utils) {
    var vm = this;
    var currentUrl;
    var hash = $stateParams.weaponHash;
    vm.collectRoll = function(isManualEvent, callback){
        if (currentUrl === $location.url() && !isManualEvent) {
            return;
        }

        var perksCollection = vm.pool;
        var roll = [];
        var statsToRecalculate = [];
        for (var perk in perksCollection) {
            var investmentStats = perksCollection[perk].vendorPerk.investmentStats;
            if (!!investmentStats.length) {
                statsToRecalculate = statsToRecalculate.concat(investmentStats);
            }
            roll.push(perksCollection[perk].vendorPerk.hash);
        }
        currentUrl = $location.url();
        utils.collectStats(statsToRecalculate, hash);
        vm.investmentStats = statsToRecalculate;
        $location.search({roll: roll});
        if (callback) {
            callback()
        }
    };
}]);
angular.module('d2RollsApp')
    .directive('weaponPerksPanel', [ '$interval', function($interval) {
        return {
            restrict: 'E',
            replace: false,
            controller: 'weaponPerksPanelCtrl as perks',
            bindToController: {
                pool: '<',
                investmentStats: '='
            },
            templateUrl: '../html/components/weaponPerksPanel/weaponPerksPanel.tpl.html',
            link: function(scope, element) {
                var timer;
                var isHolding = false;
                var target;
                element.on('contextmenu', function(event) {
                    event.preventDefault();
                    event.stopPropagation(); // not necessary in my case, could leave in case stopImmediateProp isn't available? 
                    event.stopImmediatePropagation();
                    return false;
                });
                element.on('mousedown touchstart', function(event) {
                    var previousElement = element[0].getElementsByClassName('has-tooltip')[0];
                    isHolding = true;
                    target = event.target;
                    if (previousElement && previousElement != target.parentElement) {
                        previousElement.classList.remove('has-tooltip');
                    }
                    timer = $interval(function() {                   
                        if (isHolding && target === event.target) {
                            addToolTip(target);       
                        }
                    }, 300, 1, true);
                });
                element.on('mouseup touchend', function(event) {
                    isHolding = false;
                    $interval.cancel(timer);
                    return false;
                });

                function addToolTip(eventTarget) {
                    if (eventTarget.className.includes('perk-icon')) {
                            eventTarget.parentElement.classList.add('has-tooltip');
                    }
                };
            }
        };
    }]);
angular
.module('d2RollsApp')
.controller('categoriesCtrl', ['$stateParams', 'fetchManifestService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    styleHandler
) {
    styleHandler.setContentHeight();
    var vm = this;
    var sortingType = $stateParams.sortBy;
    var lang = $stateParams.language;

    vm.categories;
    vm.lang = lang;
    vm.sortingType = sortingType;
    
    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {};
        var categoriesArray = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            try {
                if (!sortObject[itemObject[sortingType].name]) {
                    sortObject[itemObject[sortingType].name] = itemObject[sortingType].sectionHash || itemObject[sortingType].name;
                    categoriesArray.push(itemObject[sortingType].name);
                }

            } catch (e) {
                    
            };
        };
        
        vm.hashObj = sortObject;
        vm.categories = categoriesArray;
    });
}]);
angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    styleHandler
) {
    styleHandler.setContentHeight();
    var vm = this;
    var lang = $stateParams.language;
    var text = languageMapService.getDictionary(lang, 'home');
    vm.sorting = [
        {
            sortBy: 'season',
            toState: 'categories',
            text: text.newStuff
        },
        {
            sortBy: 'source',
            toState: 'categories',
            text: text.sources
        },
        {
            sortBy: 'godRoll',
            toState: 'filterState',
            text: text.godRoll
        }
    ];
    vm.lang = lang;

    fetchManifestService.getWeaponList(lang, function(){
        
    });
}]);
angular.module('d2RollsApp').controller('weaponListCtrl', [
    '$stateParams',
    'languageMapService',
    'fetchManifestService',
    'filterService',
    function(
        $stateParams,
        languageMapService,
        fetchManifestService,
        filterService
    )
{
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var filters = $stateParams.filters;
    var sortBy = $stateParams.sortBy

    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isFilterActive = false;
    vm.categoryHeaders;

    if (sortBy === 'source') {
        vm.sorting = 'subSource';
    } else {
        vm.sorting = sortBy || 'class';
    }
    
    fetchManifestService.getHashToName(function(initialHashes) { 
        filterService.getFilteredItems(function(filteredItems, sortByArray) {
            vm.categoryHeaders = sortByArray;
            vm.list = filteredItems;
        }, filters, true, vm.sorting);
    }, lang);

    function getRarityClass(hash) {
        return rarityMap[hash];
    };
}]);
angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'utils', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    utils
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;

    var perksPanel = languageMapService.getDictionary(lang, 'perksPanel');
    var statsPanel = languageMapService.getDictionary(lang, 'statsPanel');

    vm.perksPanelTextContent = {
        perksPanelHeader: perksPanel.header,
        perksPanelExpand: perksPanel.expand,
        perksPanelCollapse: perksPanel.collapse
    };
    vm.statsPanelTextContent = {
        statsPanelHeader: statsPanel.header
    };
    

    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.rarity.hash;
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = {
            primaryData: incomingData
        };

    }, function(incomingData) {
        vm.data.secondaryData = incomingData;
        setWeaponStats(vm.data.secondaryData.stats, vm.data.primaryData.hash);
        getPerksBucket(vm.data.secondaryData.perks);

    }, function(incomingData) {
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = incomingData;      
        setWeaponStats(vm.data.secondaryData.stats, vm.data.primaryData.hash); 
        getPerksBucket(vm.data.secondaryData.perks);
    });

    function setWeaponStats(data, hash) {
        utils.initWeaponStats(data, hash);
    }

    function getPerksBucket(data) {
        var roll = $stateParams.roll;
        if (!!roll.length) {
            for (var index = 0; index < roll.length; index++) {
                data[index].vendorPerk = roll[index];
            }
        }
        fetchManifestService.getPerksForSingleWeapon(data, function(perksBucket) {
            vm.perksBucket = perksBucket;
        });
    };

}]);