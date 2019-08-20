angular.module('d2RollsApp').factory('fetchManifestService', ['$http', '$q', function($http, $q) {
    var weaponListObject = [];
    var perksBucket = {};
    var lastLanguage;
    var weaponData = {};
    var rarityMap = {
        2: 'common',
        3: 'uncommon',
        4: 'rare',
        5: 'legendary',
        6: 'exotic'
    };

    var dataDownloadDeferred = $q.defer();
    var filterHashesDeferred = $q.defer();
    var perksDownloadDeferred = $q.defer();
    var hashToName = {
        class: {},
        rarity: {},
        slot: {},
        season: {},
        ammoType: {},
        source: {},
        damageType: {}
    };

    function getWeaponList (language, callback) {
        if (Object.keys(weaponListObject).length && lastLanguage === language && callback) {
            callback(weaponListObject);

            return;
        }
        var weaponListPromise = $q(function(resolve) {
            resolve($http.post('/getWeaponList', JSON.stringify({language: language})).then(function(response) {
                weaponListObject = response.data;
                if (callback) {
                    callback(weaponListObject);
                }
                return weaponListObject;
            }));
        });

        var weaponDataPromise = $q(function(resolve){
            resolve($http.post('/getWeaponData', JSON.stringify({language: language})).then(function(response) {
                weaponData = response.data;
                if (callback) {
                    callback(weaponListObject);
                }

                dataDownloadDeferred.resolve();;
            }));
        });

        var weaponPerksPromise = $q(function(resolve) {
            resolve($http.post('/getWeaponPerks', JSON.stringify({language: language})).then(function(response) {
                perksBucket = response.data;
                perksDownloadDeferred.resolve(perksBucket);
            }));
        });

        lastLanguage = language;

        $q.all([
            weaponListPromise,
            weaponDataPromise,
            weaponPerksPromise
        ]).then(function(responses) {
            var items = responses[0];
            for (var hash in items) {
                
                if (!hashToName.class[items[hash].class.hash]) {
                    hashToName.class[items[hash].class.hash] = items[hash].class.name;
                }
                if (!hashToName.slot[items[hash].slot.hash]) {
                    hashToName.slot[items[hash].slot.hash] = items[hash].slot.name;
                }
                if (!hashToName.rarity[items[hash].rarity.hash]) {
                    hashToName.rarity[items[hash].rarity.hash] = items[hash].rarity.name;
                }
                if (!hashToName.season[items[hash].season.hash]) {
                    hashToName.season[items[hash].season.name] = items[hash].season.name;
                }
                if (!hashToName.source[items[hash].source.sectionHash]) {
                    hashToName.source[items[hash].source.sectionHash] = items[hash].source.name;
                }
                if (!hashToName.damageType[items[hash].damageType.hash]) {
                    hashToName.damageType[items[hash].damageType.hash] = items[hash].damageType.name;
                }
                hashToName.ammoType = {
                    1: 1,
                    2: 2,
                    3: 3
                }
            }
            filterHashesDeferred.resolve();
        }).catch(function(error) {
            console.log(error);
        });
    };
    function getHashToName(callback, language) {
        if (Object.keys(weaponListObject).length && lastLanguage === language && callback) {
            callback(hashToName);
            return;
        }
        $q.when(filterHashesDeferred.promise).then(function() {
            callback(hashToName);
        });
    };
    
    function getSingleWeaponData (language, hash, listCallback, dataCallback, singleDataCallback) {
        if (
            Object.keys(weaponListObject).length && 
            Object.keys(weaponData).length && 
            lastLanguage === language && 
            listCallback && dataCallback
        ) {

            listCallback(weaponListObject[hash]);
            dataCallback(weaponData[hash]);

            return;
        }

        if (
            Object.keys(weaponListObject).length && 
            !Object.keys(weaponData).length && 
            lastLanguage === language && 
            listCallback && dataCallback
        ) {
            listCallback(weaponListObject[hash]);
            $q.when(dataDownloadDeferred.promise).then(function() {
                dataCallback(weaponData[hash]);
            });

            return;
        }

        lastLanguage = language;

        $q.when(
            $http.post('/getSingleWeapon', JSON.stringify({language: language, hash: hash}))
        ).then(function(response) {
            if (singleDataCallback) {
                singleDataCallback(response.data);
            }
        }).then(function(){
            getWeaponList(language);
        }).catch(function(error) {
            console.log(error);
        });
    };

    function getPerksForSingleWeapon(bucket, perksPanelCallback) {
        var bucketToReturn = [];
    
        if (!!Object.keys(perksBucket).length) {
            perksPanelCallback(mapPerksName());
            return ;
        }

        $q.when(perksDownloadDeferred.promise).then(function() {
            perksPanelCallback(mapPerksName());
        });

        function mapPerksName() {
            for (var perk of bucket) {
                var objectToPush = {};
                objectToPush.vendorPerk = perksBucket[perk.vendorPerk];
                if (perk.randomizedPerks.length) {
                    var randomizedPerks = [];
                    for (var randomPerk of perk.randomizedPerks) {
                        randomizedPerks.push(perksBucket[randomPerk])
                    }
                    objectToPush.randomizedPerks = randomizedPerks;
                }
                bucketToReturn.push(objectToPush);
            }
            
            return bucketToReturn;
        }
    }

    return {
        getPerksForSingleWeapon: getPerksForSingleWeapon,
        getSingleWeaponData: getSingleWeaponData,
        getWeaponList: getWeaponList,
        rarityMap: rarityMap,
        getHashToName: getHashToName,
        weaponData: weaponData
    };
}]);