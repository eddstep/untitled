/**
 * Created by Code on 30.12.2016.
 */
var express = require('express');
var router = express.Router();

var orders = require('./../controllers/orders');


router.get('/', orders.getAllProducts, function (req, res){

    res.render('orders', {title: 'Все товары из заказов', products: req.products});
});

module.exports = router;