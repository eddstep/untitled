/**
 * Created by Code on 18.01.2017.
 */
var db = require('./../bin/knex');

function subQuery(dbTable, state){
    return db(dbTable).where('state', state).select('id');
}

module.exports = {
    getOcOrderItems: function (){
        return db('order_items').where('order_id', 'in', subQuery('orders_from_oc', 5))
            .join('goods', 'goods.sku', '=', 'order_items.sku')
            .select('order_items.sku', 'goods.name', db.raw('sum(quantity) as ocQuantity'))
            .groupBy('order_items.sku');
    },

    getPromOrderItems: function (){
        return db('order_items').where('order_id', 'in', subQuery('orders_from_prom', 'closed'))
            .join('goods', 'goods.sku', '=', 'order_items.sku')
            .select('order_items.sku', 'goods.name', db.raw('sum(quantity) as promQuantity'))
            .groupBy('order_items.sku');
    },


};