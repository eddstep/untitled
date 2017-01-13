/**
 * Created by Code on 30.12.2016.
 */
var db = require('./../bin/knex');

module.exports = {
    getPromOrders: function (req, res, next){
        return db.select().table('orders_from_prom')
 //       req.orders.controller = db.select().table('orders_from_controller');
        .then(function (data){
            req.orders = data;
            next();
        });
    },

    getAllProducts: function (req, res, next){
        return db
            .select('order_items.sku', 'goods.name', db.raw('sum(quantity)'))
            .from('order_items')
            .innerJoin('goods', 'order_items.sku', 'goods.sku')
            .groupBy('order_items.sku')
        .then(function (data){
            req.products = data;
            next();
        });
    }
};