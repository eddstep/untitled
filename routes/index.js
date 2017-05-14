var express = require('express');
var router = express.Router();

router.use(function (req, res, next){
    require('./../controllers/exchangeRates').parseCurrentRate('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    next();
});

router.get('/', function (req, res){
    res.render('index', {title: 'controller'});
});

module.exports = router;