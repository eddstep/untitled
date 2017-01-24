/**
 * Created by Code on 23.01.2017.
 */
var db = require('./../bin/knex');

module.exports = {
    getIncomingGoods: function (){
        return db('incoming_goods')
            .join('goods', 'goods.sku', '=', 'incoming_goods.sku')
            .select('incoming_goods.sku', 'incoming_goods.quantity', 'goods.name').groupBy('sku');
    }
};

