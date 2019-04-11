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