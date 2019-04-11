angular.module('d2RollsApp', ['ui.router'])
.config(function (
    $locationProvider,
    $stateProvider,
    $urlRouterProvider
) {
    var weaponListState = {
        name: 'weaponList',
        url: '/weaponList/:language',
        params: {
            language: 'en',
            squash: true
        },
        templateUrl: '../html/routing/stateTemplates/weaponList.tpl.html',
        controller: 'weaponListCtrl',
        controllerAs: 'weapons'
    };

    var weaponViewState = {
        name: 'weaponView',
        url: '/weaponView/:language/{weaponHash}/',
        params: {
            language: 'en', 
            squash: true
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
    var weaponListArray = [];
    var lastLanguage;
    var weaponData = {};

    function getWeaponList (language, callback) {
        if (weaponListArray.length && lastLanguage === language && callback) {
            callback(weaponListArray);

            return;
        }

        lastLanguage = language;
        
        $q.all([
            $http.post('/getWeaponList', JSON.stringify({language: language})),
            $http.post('/getWeaponData', JSON.stringify({language: language}))
        ]).then(function(responses) {
            weaponListArray = responses[0].data;
            weaponData = responses[1].data;
            callback(weaponListArray);
        }).catch(function(error) {
            console.log(error);
        });
    };

    function getSingleWeaponData (language, callback) {

    }

    return {
        getWeaponList: getWeaponList,
        weaponData: weaponData
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
angular.module('d2RollsApp')
    .controller('footerPanelCtrl', ['$scope','$state', function ($scope, $state) {
        $scope.string = 'Footer panel'
    }])
angular.module('d2RollsApp')
    .directive('footerPanel', function () {
        return {
            restrict: 'C',
            controller: 'footerPanelCtrl',
            templateUrl: '../html/components/footerPanel/footerPanel.tpl.html',
            link: function (scope) {
            }
        }
    })
angular.module('d2RollsApp')
    .directive('weaponListItem', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                listItem: '='
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
    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    };

    vm.getRarityClass = getRarityClass;
    vm.searchPlaceHolder = dictionary.search;
    vm.lang = lang;

    fetchManifestService.getWeaponList(lang, function(arrayOfItems){
        vm.list = [];
        for (let item in arrayOfItems) {
            vm.list.push(arrayOfItems[item]);

        }
    });
    
    function getRarityClass(hash) {

        return rarityMap[hash];
    }
}]);
angular.module('d2RollsApp').controller('weaponViewCtrl', ['$stateParams', function(
    $stateParams
) {
    console.log($stateParams);
    var vm = this;
}]);