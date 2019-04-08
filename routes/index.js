var express = require('express');
var router = express.Router();
var path = require('path');
var weaponList = require('../data/ru/weaponMainList.json');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.sendFile(path.join(__dirname, '../', 'public', 'index.html'));
});

router.post('/getWeaponList', function (req, res) {
    console.log('object');
    var lang = req.body.language || 'en';
    // var path = '../data/' + lang + 'weaponMainList.json';
    // 
    // console.log('GU');
    res.send(JSON.stringify(weaponList));
});

module.exports = router;