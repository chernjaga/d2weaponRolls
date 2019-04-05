angular.module('d2RollsApp', ['ui.router'])
.config(function (
    $stateProvider,
    $urlRouterProvider
) {
    var weaponListState = {
        name: 'weaponList',
        url: '/weapon_list',
        templateUrl: '../html/routing/stateTemplates/weaponList.tpl.html',
        controller: function(){
            console.log('test');
        }
    };

    $stateProvider.state(weaponListState);
    $urlRouterProvider.otherwise('/weapon_list');
});