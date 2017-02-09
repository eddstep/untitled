/**
 * Created by Code on 07.02.2017.
 */

var express = require('express');
var router = express.Router();
var inout = require('./../controllers/inout');

router.get('/', function (req, res, next){
    inout.calcMoney().then(function (data){
        res.render('inout', {
            title: 'Дебит кредит товара',
            products: data
        })
    })
});

module.exports = router;