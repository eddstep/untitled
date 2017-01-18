/**
 * Created by Code on 18.01.2017.
 */
var db = require('./../bin/knex');

module.exports = {
    getOrderItems: function (){
        return db.select('order_items.sku', 'goods.name', db.raw('sum(quantity)'))
            .from('order_items')
            .innerJoin('goods', 'order_items.sku', 'goods.sku')
            .groupBy('order_items.sku')
    }
};