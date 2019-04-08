angular.module('d2RollsApp').factory('fetchManifestService', ['$http', function($http) {
    var weaponListArray = [];

    function getWeaponList (language, callback) {
        if (weaponListArray.length) {

            callback(weaponListArray);

            return;
        }


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