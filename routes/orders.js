/**
 * Created by Code on 11.12.2016.
 */
var express = require('express');
var router = express.Router();

var parseProm = require('./../controllers/promOrderParse');
var parseOc = require('./../controllers/ocOrderParse');
var orders = require('./../controllers/orders');


/* GET parse page. */
router.use(function (req, res, next){
    Promise.resolve(parseProm())
        .then(function (){
            parseOc();
        })
        .then(function (){
            next();
        })
});

router.get('/', function (req, res, next){
    orders.orderProducts()
        .then(function (data){
            res.render('orders', {title: 'Все товары из заказов', products: data});
        })
        .catch(next);
});

module.exports = router;