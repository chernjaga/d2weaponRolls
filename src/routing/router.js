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
    // $locationProvider.html5Mode(true);
});