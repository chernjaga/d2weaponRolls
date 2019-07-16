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