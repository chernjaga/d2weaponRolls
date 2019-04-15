angular.module('d2RollsApp', ['ui.router'])
.config(function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider
) {
    var weaponListState = {
        name: 'weaponList',
        url: '/weaponList/{language}',
        params: {
            language: 'en'
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

    $stateProvider.state(weaponListState);
    $stateProvider.state(weaponViewState);
    $urlRouterProvider.otherwise('/weaponList/en');
    $locationProvider.html5Mode(true);
});
angular.module('d2RollsApp').factory('fetchManifestService', ['$http', '$q', function($http, $q) {
    var weaponListObject = [];
    var lastLanguage;
    var weaponData = {};
    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    };


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
                resolve();
            });
        });

        lastLanguage = language;
        
        $q.all([
            weaponListPromise,
            weaponDataPromise
        ]).catch(function(error) {
            console.log(error);
        });
    };
    
    function getSingleWeaponData (language, hash, callback) {
        if (Object.keys(weaponListObject).length && Object.keys(weaponData).length && lastLanguage === language && callback) {

            callback({
                primaryData:  weaponListObject[hash],
                secondaryData: weaponData[hash]
            })

            return;
        }
        if (!Object.keys(weaponData).length) {
            console.log('ne uspel');
        }

        lastLanguage = language;

        $q.when(
            $http.post('/getSingleWeapon', JSON.stringify({language: language, hash: hash}))
        ).then(function(response) {
            if (callback) {
                callback(response.data);
            }
        }).then(function(){
            getWeaponList(language);
        }).catch(function(error) {
            console.log(error);
        });
    }

    return {
        getWeaponList: getWeaponList,
        weaponData: weaponData,
        getSingleWeaponData: getSingleWeaponData,
        rarityMap: rarityMap
    };
}]);
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
angular.module('d2RollsApp').controller('footerPanelCtrl', [function () {
    var vm = this;
    vm.text = '< To weapon list';
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
    })
angular.module('d2RollsApp')
    .directive('weaponListItem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: '<',
                language: '<'
            },
            templateUrl: '../html/components/weaponListItem/weaponListItem.tpl.html',
        }
    })
angular.module('d2RollsApp').controller('weaponListCtrl', ['$stateParams', 'languageMapService', 'fetchManifestService',  function(
    $stateParams,
    languageMapService,
    fetchManifestService
){
    var vm = this;
    var lang = $stateParams.language;
    var dictionary = languageMapService.getDictionary(lang);
    var rarityMap = fetchManifestService.rarityMap

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = dictionary.search;
    vm.lang = lang;
    vm.isLoaded = false;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems){
        vm.list = [];
        for (let item in arrayOfItems) {
            vm.list.push(arrayOfItems[item]);
        }
        vm.isLoaded = !!vm.list.length;
    });
    
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);
angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', 'fetchManifestService', function(
    $stateParams,
    fetchManifestService
) {  
    var vm = this;
    var rarityMap = fetchManifestService.rarityMap;
    var lang = $stateParams.language;
    var weaponHash = $stateParams.weaponHash;
    
    fetchManifestService.getSingleWeaponData(lang, weaponHash, function(incomingData){
        var rarityHash = incomingData.primaryData.rarity.hash
        vm.rarityClass = rarityMap[rarityHash];
        vm.data = Object.assign(incomingData.primaryData, incomingData.secondaryData);
        
        console.log(vm.data);
    });

}]);