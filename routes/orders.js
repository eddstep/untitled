/**
 * Created by Code on 11.12.2016.
 */
var express = require('express');
var router = express.Router();

var parseProm = require('./../controllers/promOrderParse');
var parseOc = require('./../controllers/ocOrderParse');
var orders = require('./../controllers/orders');

var productData = [];
var orderData = [];

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
    Promise.all([orders.orderProducts(), orders.orderTotalSum()])
        .then(function (data){
            productData = data[0];
            orderData = data[1];
        })
        .then(function (){
            res.render('orders', {
                title: 'Все товары из заказов',
                products: productData,
                sum: orderData
            });
        })
        .catch(next);
});

module.exports = router;