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

        lastLanguage = language;
        
        $q.all([
            $http.post('/getWeaponList', JSON.stringify({language: language})),
            $http.post('/getWeaponData', JSON.stringify({language: language}))
        ]).then(function(responses) {
            weaponListObject = responses[0].data;
            weaponData = responses[1].data;
            if (callback) {
                callback(weaponListObject);
            }
        }).catch(function(error) {
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