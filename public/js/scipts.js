angular.module('d2RollsApp', ['ui.router', 'ngAnimate'])
.config(function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider
) {
    var weaponListState = {
        name: 'weaponList',
        url: '/weaponList/{language}?sortBy',
        params: {
            language: 'en',
            sortBy: 'rarity'
        },
        templateUrl: '../html/routing/stateTemplates/weaponList.tpl.html',
        controller: 'weaponListCtrl',
        controllerAs: 'weapons'
    };

    var weaponViewState = {
        name: 'weaponView',
        url: '/weaponView/{language}/{weaponHash}',
        params: {
            language: 'en'
        },
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
        templateUrl: '../html/routing/stateTemplates/home.tpl.html'
    };

    $stateProvider.state(homeState);
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
angular.module('d2RollsApp').controller('footerPanelCtrl', [function () {
    var vm = this;
    vm.text = ' To weapon list';
    vm.lang = location.pathname.split('/')[2] || 'en';
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
angular.module('d2RollsApp')
    .directive('weaponPerksPanel', [ '$interval', function($interval) {
        return {
            restrict: 'E',
            replace: false,
            scope: {
                pool: '<',
                text: '<'
            },
            templateUrl: '../html/components/weaponPerksPanel/weaponPerksPanel.tpl.html',
            link: function(scope, element, attr) {
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

    vm.text = {
        sortByWeaponClass: homeText.sortByWeaponClass,
        sortByRarity: homeText.sortByRarity,
        sortBySource: homeText.sortBySource,
        sortBySeasons: homeText.sortBySeasons
    };

    fetchManifestService.getWeaponList(lang, function(){
        
    });
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
    var sortingType = $stateParams.sortBy;

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = search;
    vm.lang = lang;
    vm.isLoaded = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems) {
        var sortObject = {}
        vm.list = [];
        for (var item in arrayOfItems) {
            var itemObject = arrayOfItems[item];
            if (!sortObject[itemObject[sortingType].name]) {
                sortObject[itemObject[sortingType].name] = true;
            }
            itemObject.sortingCategory = itemObject[sortingType].name;
            vm.list.push(itemObject);
        };
        vm.categoryHeaders = sortObject;
        vm.isLoaded = !!vm.list.length;
    });
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);
angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', 'languageMapService', function(
    $stateParams,
    fetchManifestService,
    languageMapService
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;

    var perksPanel = languageMapService.getDictionary(lang, 'perksPanel');

    vm.perksPanelTextContent = {
        perksPanelHeader: perksPanel.header,
        perksPanelExpand: perksPanel.expand,
        perksPanelCollapse: perksPanel.collapse
    }
    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.rarity.hash;
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = {
            primaryData: incomingData
        };

    }, function(incomingData) {
        vm.data.secondaryData = incomingData;
        getPerksBucket(vm.data.secondaryData.perks);

    }, function(incomingData) {
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = incomingData;
        getPerksBucket(vm.data.secondaryData.perks);
    });

    function getPerksBucket(data) {
        fetchManifestService.getPerksForSingleWeapon(data, function(perksBucket) {
            vm.perksBucket = perksBucket;
        });
    };

}]);