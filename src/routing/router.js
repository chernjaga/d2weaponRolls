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
            language: 'en'
        },
        templateUrl: '../html/routing/stateTemplates/weaponList.tpl.html',
        controller: 'weaponListCtrl',
        controllerAs: 'weapons'
    };

    $stateProvider.state(weaponListState);
    $urlRouterProvider.otherwise('/weaponList/en');
    // $locationProvider.html5Mode(true);
});