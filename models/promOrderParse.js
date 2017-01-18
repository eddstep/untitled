/**
 * Created by Code on 16.01.2017.
 */
var db = require('./../bin/knex');

module.exports = {
    ordersToDb: function (item){
        db('orders_from_prom').where('id', item['id'])
            .update(item)
            .then(function (row){
                if (!row){
                    return db('orders_from_prom').insert(item)
                        .catch(function (err){
                            console.log('insert error: ' + err);
                        })
                }
            })
            .catch(function (err){
                console.log('update error: ' + err);
            });
    },

    itemsToDb: function (product){
        db('order_items').where(function (){
            this.where('order_id', product['order_id'])
                .andWhere('sku', product['sku'])
        })
            .update({
                quantity: product['quantity'],
                price: product['price']
            })
            .then(function (row){
                if (!row){
                    return db('order_items').insert(
                        {
                            order_id: product['order_id'],
                            sku: product['sku'],
                            quantity: product['quantity'],
                            price: product['price']
                        })
                        .catch(function (err){
                            console.log('insert error: ' + err);
                        })
                }
            })
            .catch(function (err){
                console.log('update error: ' + err);
            })
    }
};

