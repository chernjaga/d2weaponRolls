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
            filters: [],
            isFullList: false
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
    }

    $stateProvider.state(homeState);
    $stateProvider.state(categories);
    $stateProvider.state(weaponListState);
    $stateProvider.state(weaponViewState);
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
    var perksDownloadDeferred = $q.defer();

    function getWeaponList (language, callback) {
        if (Object.keys(weaponListObject).length && lastLanguage === language && callback) {
            callback(weaponListObject);

            return;
        }
        var weaponListPromise = $q(function(resolve){
            $http.post('/getWeaponList', JSON.stringify({language: language})).then(function(response) {
                weaponListObject = response.data;
                if (callback) {
                    callback(weaponListObject);
                }
                resolve();
            });
        });

        var weaponDataPromise = $q(function(resolve){
            $http.post('/getWeaponData', JSON.stringify({language: language})).then(function(response) {
                weaponData = response.data;
                if (callback) {
                    callback(weaponListObject);
                }

                dataDownloadDeferred.resolve();
                resolve();
            });
        });

        var weaponPerksPromise = $q(function(resolve) {
            $http.post('/getWeaponPerks', JSON.stringify({language: language})).then(function(response) {
                perksBucket = response.data;
                perksDownloadDeferred.resolve(perksBucket);
            });
        });

        lastLanguage = language;

        $q.all([
            weaponListPromise,
            weaponDataPromise,
            weaponPerksPromise
        ]).catch(function(error) {
            console.log(error);
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
                    objectToPush.randomizedPerks = randomizedPerks
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
        weaponData: weaponData
    };
}]);
angular.module('d2RollsApp').factory('languageMapService', [ function() {
    var dictionary = {
        ru: {
            search: 'Поиск',
            filter: {
                button: 'Фильтр',
                weaponClass: 'Класс оружия',
                slot: 'Слот оружия',
                damageType: 'Тип урона',
                rarity: 'Редкость',
                frame: 'Рама',
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
                sortByWeaponClass: 'Сортировать по классу оружия',
                sortByRarity: 'Сортировать по редкости',
                sortBySource: 'Сортировать по источнику получения',
                sortBySeasons: 'Сортировать по сезонам',
                all: 'Весь список'
            }
        },
        en: {
            search: 'Search',
            filter: {
                button: 'Filtr',
                weaponClass: 'Weapon class',
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
                sortByWeaponClass: 'Sort by weapon class',
                sortByRarity: 'Sort by rarity',
                sortBySource: 'Sort by source',
                sortBySeasons: 'Sort by seasons',
                all: 'All'
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
    };

    function initWeaponStats(stats) {
            statsStoreObject = JSON.parse(JSON.stringify(stats));
            statInit.resolve(stats);        
    };

    function collectStats(investmentStats) {
        if (Object.keys(statsStoreObject).length) {
            recalculateStats(investmentStats);
            return;
        }
        $q.when(statInit.promise).then(function() {
            recalculateStats(investmentStats);
        });
    };

    function recalculateStats(newStats) {
        recalculatedStats = JSON.parse(JSON.stringify(statsStoreObject));
        for (item of newStats) {
            var hash = item.statTypeHash;
            if (recalculatedStats[hash]) {
                recalculatedStats[hash].statValue = statsStoreObject[hash].statValue + item.value;
            }
        }
        
        recalculateDeffer.resolve(recalculatedStats);
    };

    function getNewStats(callback) {
        $q.when(recalculateDeffer.promise).then(function() {
            var output = statsFilter(recalculatedStats);
            callback(output);
        });
    };

    return {
        collectStats: collectStats,
        initWeaponStats: initWeaponStats,
        getNewStats: getNewStats
    };
}]);
angular.module('d2RollsApp').factory('styleHandler', [function() {
    var contentHeight;
    function setContentHeight() {
        if (contentHeight) {
            return contentHeight;
        }
      
        var footer = document.getElementsByClassName('footer-menu')[0];
        var bodyHeight = footer.getBoundingClientRect().bottom;
        var footerHeight = getComputedStyle(footer).height.replace('px', '');
        var menuHeight = bodyHeight - footerHeight
        var view = document.getElementsByClassName('view')[0];
        view.style.height = menuHeight - 32 + 'px';
    };
    
    return {
        setContentHeight: setContentHeight
    }
}]);
angular.module('d2RollsApp').controller('filterButtonCtrl', ['$stateParams', 'languageMapService', function (
    $stateParams,
    languageMapService
) {
    var vm = this;
    var lang = $stateParams.language;
    vm.text = languageMapService.getDictionary(lang, 'filter').button;
    vm.isExpanded = false;
}]);
angular.module('d2RollsApp')
    .directive('filterButton', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'filterButtonCtrl as filterButton',
            templateUrl: '../html/components/filterButton/filterButton.tpl.html'
        }
    });
angular.module('d2RollsApp').controller('footerPanelCtrl', ['$state', '$stateParams', function ($state, $stateParams) {
    var vm = this;
    vm.$onInit = function() {
        var lang = $stateParams.language;
        vm.lang = $stateParams.language;
        vm.isOpenedSetting = false;
        vm.changeLanguage = function() {
            var params = $stateParams;
            params.language = $stateParams.language === 'ru' ? 'en' : 'ru';
            var stateName = $state.current.name;
            vm.isOpenedSetting = false;
            $state.go(stateName, params);
        }
    };
}]);
angular.module('d2RollsApp')
    .directive('footerPanel', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'footerPanelCtrl',
            controllerAs: 'footer',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html'
        }
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
angular.module('d2RollsApp').controller('weaponFilterCtrl', ['$state', '$stateParams', 'languageMapService', function ($state, $stateParams, languageMapService) {
    var vm = this;
    var lang = $stateParams.language;
    var includedFilters = []
    vm.text = languageMapService.getDictionary(lang, 'filter');
    vm.classes = [5,6,7,8,9,10,11,13,14,54,153950757,3317538576,3954685534];
    vm.slots = [2,3,4];
    vm.damageTypes = {
        '2303181850': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_9fbcfcef99f4e8a40d8762ccb556fcd4.png',
        '3373582085': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_3385a924fd3ccb92c343ade19f19a370.png',
        '1847026933': '/common/destiny2_content/icons/DestinyDamageTypeDefinition_2a1773e10968f2d088b97c22b22bba9e.png',
        '3454344768':'/common/destiny2_content/icons/DestinyDamageTypeDefinition_290040c1025b9f7045366c1c7823da6a.png'
    };
    vm.rarity = ['exotic', 'legendary', 'rare', 'uncommon', 'common'];
    vm.toggleFilter = function(target, filterBy, hash) {
        target.isIncluded = !target.isIncluded;
    };
}]);
angular.module('d2RollsApp')
    .directive('weaponFilter', function () {
        return {
            restrict: 'E',
            replace: false,
            controller: 'weaponFilterCtrl as filter',
            templateUrl: '../html/components/weaponFilter/weaponFilter.tpl.html'
        };
    });
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
    var vm = this;
    var sortingType = $stateParams.sortBy;
    var lang = $stateParams.language;

    console.log($stateParams);
    styleHandler.setContentHeight();

    vm.isLoaded = false;
    vm.categories = [];
    vm.lang = lang;
    vm.sortingType = sortingType;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {};
        var categoriesArray = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            try {
                if (!sortObject[itemObject[sortingType].name]) {
                    sortObject[itemObject[sortingType].name] = true;
                    categoriesArray.push(itemObject[sortingType].name);
                }

            } catch (e) {
                    
            };
        };
        vm.categories = categoriesArray;
        vm.isLoaded = !!vm.categories.length;
    });
}]);
angular.module('d2RollsApp').controller('homeCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', 'styleHandler', function(
    $stateParams,
    fetchManifestService,
    languageMapService,
    styleHandler
) {
    var vm = this;
    var lang = $stateParams.language;
    var homeText = languageMapService.getDictionary(lang, 'home');

    vm.lang = lang;

    styleHandler.setContentHeight();
    vm.textSortAll = homeText.all;
    vm.sort = {
        rarity: homeText.sortByRarity,
        class: homeText.sortByWeaponClass,
        source: homeText.sortBySource,
        season: homeText.sortBySeasons
    } 

    fetchManifestService.getWeaponList(lang, function(){});
}]);
angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var search = languageMapService.getDictionary(lang).search;
    var rarityMap = fetchManifestService.rarityMap;
    var isFullList = $stateParams.isFullList;
    var filters = $stateParams.filters;
    // var sortType = $stateParams.sortBy;
    var sortType = 'class';
    
    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;
    vm.isFilterActive = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];

        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (isShownByFilter(itemObject, filters) || isFullList) {
                itemObject.sortType = itemObject[sortType].name;
                vm.list.push(itemObject);
                if (!itemObject[itemObject[sortType].name]) {
                    sortObject[itemObject[sortType].name] = true;
                }
            }
        }
        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });

    function isShownByFilter(item, filters, hashFilter) {
        var filtersArray = [];
        var isApplied = false;
        if (typeof filters === 'string') {
            filtersArray.push(filters);
        } else {
            filtersArray = filters;
        }
        for (var filter in filtersArray) {
            var categoryName = filtersArray[filter].split(':')[0];
            var categoryValue = filtersArray[filter].split(':')[1];
            if (!item[categoryName]) {
                return false;
            }
            if (item[categoryName].name === categoryValue) {
                isApplied = true;
                break;
            }
        }

        return isApplied;
    };

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
        console.log(vm.data);
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