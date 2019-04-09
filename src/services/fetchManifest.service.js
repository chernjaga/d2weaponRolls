angular.module('d2RollsApp').factory('fetchManifestService', ['$http', function($http) {
    var weaponListArray = [];
    var lastLanguage;

    function getWeaponList (language, callback) {
        if (weaponListArray.length && lastLanguage === language) {

            callback(weaponListArray);

            return;
        }

        lastLanguage = language;
        $http.post('/getWeaponList', JSON.stringify({language: language})).then(function(response) {
            weaponListArray = response.data;
            callback(weaponListArray);
        }).catch(function(error) {
            console.log(error);
        });

    };

    return {
        getWeaponList: getWeaponList
    };
}]);