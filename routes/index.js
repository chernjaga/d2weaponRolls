var express = require('express');
var router = express.Router();
var path = require('path');

var weaponList = {
    ru: require('../data/ru/weaponMainList.json'),
    en: require('../data/en/weaponMainList.json')
};
var weaponData = {
    ru: require('../data/ru/weaponStats.json'),
    en: require('../data/en/weaponStats.json')
};

var weaponPerks = {
    ru: require('../data/ru/perksBucket.json'),
    en: require('../data/en/perksBucket.json')
};

var perk2hash = require('../data/perk2hash.json');

/* GET home page. */
router.get('/*', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

router.post('/getWeaponList', function (req, res) {
    var lang = req.body.language;
    res.send(JSON.stringify(weaponList[lang]));
});

router.post('/getWeaponData', function (req, res) {
    var lang = req.body.language;
    res.send(JSON.stringify(weaponData[lang]));
});

router.post('/getPerk2hash', function (req, res) {
    res.send(JSON.stringify(perk2hash));
});

router.post('/getWeaponPerks', function (req, res) {
    var lang = req.body.language;
    res.send(JSON.stringify(weaponPerks[lang]));
});

router.post('/getSingleWeapon', function (req, res) {
    var lang = req.body.language;
    var hash = req.body.hash;
    res.send(JSON.stringify({
        primaryData: weaponList[lang][hash],
        secondaryData: weaponData[lang][hash]
    }));
});

module.exports = router;