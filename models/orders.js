/**
 * Created by Code on 18.01.2017.
 */
var db = require('./../bin/knex');

function subQuery(table, state){
    return db(table).where('state', state).select('id');
}

module.exports = {
    getOcOrderItems: function (){
        return db('order_items').where('order_id', 'in', subQuery('orders_from_oc', 5))
            .join('goods', 'goods.sku', '=', 'order_items.sku')
            .select('order_items.sku', 'goods.name', 'goods.oc_id', db.raw('sum(quantity) as ocQuantity'))
            .groupBy('order_items.sku');
    },

    getPromOrderItems: function (){
        return db('order_items').where('order_id', 'in', subQuery('orders_from_prom', 'closed'))
            .join('goods', 'goods.sku', '=', 'order_items.sku')
            .select('order_items.sku', 'goods.name', db.raw('sum(quantity) as promQuantity'))
            .groupBy('order_items.sku');
    },

    getOrdersTotalSum: function (table, state){
        return db(table).where('state', state).select(db.raw('sum(priceUAH) as sum'));
    },

    getOrdersByMonth: function (table, state){
        return db(table).where('state', state).select(db.raw('count(priceUAH) as quantity, sum(priceUAH) as sum, monthName(ate) as month, year(date) as year'))
            .groupByRaw('month(date) ORDER BY date DESC');
    }
};