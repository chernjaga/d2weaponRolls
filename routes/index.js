var express = require('express');
var router = express.Router();
var path = require('path');
var weaponList = {
    ru: require('../data/ru/weaponMainList.json'),
    en: require('../data/en/weaponMainList.json')
};
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

router.post('/getWeaponList', function (req, res) {
    var lang = req.body.language;
    res.send(JSON.stringify(weaponList[lang]));
});

module.exports = router;