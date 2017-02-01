/**
 * Created by Code on 29.01.2017.
 */
var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var db = require('./../bin/knex');
var orders = require('./../controllers/orders');

function subQuery(dbTable, state){
    return db(dbTable).where('state', state).select('id');
}

function getData(){
    return db('order_items').where('order_id', 'in', subQuery('orders_from_oc', 5))
        .join('goods', 'goods.sku', '=', 'order_items.sku')
        .select('order_items.sku', 'goods.name', db.raw('sum(quantity) as ocQuantity'))
        .groupBy('order_items.sku');
}

router.use('/', function (req, res, next){
    orders.orderProducts().then(function (data){
        res.send(data);
    }).catch(next);
});

module.exports = router;
