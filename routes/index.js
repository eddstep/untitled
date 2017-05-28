var express = require('express');
var router = express.Router();
var orders = require('./../controllers/orders').orderGroupByDate;

var data = {};

router.use(function (req, res, next){
    require('./../controllers/exchangeRates').parseCurrentRate('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    next();
});

router.use(function (req, res, next){
    Promise.resolve(orders())
        .then(function (value){
            data.oc = value.oc;
            data.prom = value.prom;
        }).then(function (){
        next();
    })
});

router.get('/', function (req, res){
    res.render('index', {
        title: 'controller',
        data: data
    });
});

module.exports = router;