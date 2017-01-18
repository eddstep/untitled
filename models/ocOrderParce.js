/**
 * Created by Code on 17.01.2017.
 */
var db = require('./../bin/knex');

module.exports = {
    getOrdersFromOc: function (){
        return db.select('order_id', 'firstname', 'lastname', 'email', 'telephone', 'payment_company',
            'payment_method', 'shipping_address_1', 'shipping_city',
            'shipping_postcode', 'shipping_code', 'comment', 'total',
            'order_status_id', 'currency_value', 'date_added', 'date_modified').from('oc_order')
    },
    ordersToDb: function (elem){
        return db('orders_from_controller').where('id', elem['order_id'])
            .update({
                name: elem['firstname'] + ' ' + elem['lastname'],
                email: elem['email'],
                phone: elem['telephone'],
                paymentType: elem['payment_method'],
                company: elem['payment_company'],
                address: elem['shipping_address'] + ' ' + elem['shipping_city'],
                postCode: elem['shipping_postcode'],
                deliveryType: elem['shipping_code'],
                deliveryCost: elem['deliveryCost'],
                priceUAH: elem['priceUAH'],
                comment: elem['comment'],
                state: elem['order_status_id'],
                date_modified: elem['date_modified']
            })
            .then(function (row){
                if (!row){
                    return db('orders_from_controller').insert({
                        id: elem['order_id'],
                        name: elem['firstname'] + ' ' + elem['lastname'],
                        email: elem['email'],
                        phone: elem['telephone'],
                        paymentType: elem['payment_method'],
                        company: elem['payment_company'],
                        address: elem['shipping_address'] + ' ' + elem['shipping_city'],
                        postCode: elem['shipping_postcode'],
                        deliveryType: elem['shipping_code'],
                        deliveryCost: elem['deliveryCost'],
                        priceUAH: elem['priceUAH'],
                        comment: elem['comment'],
                        state: elem['order_status_id'],
                        date: elem['date_added'],
                        date_modified: elem['date_modified']
                    })
                        .catch(function (err){
                            console.log('insert error: ' + err);
                        })
                }
            })
            .catch(function (err){
                console.log('update error: ' + err);
            })
    },
    getOrderItemsFromOc: function (){
        return db('oc_order_product').join('oc_order', 'oc_order_product.order_id', 'oc_order.order_id')
            .select('oc_order_product.order_id', 'oc_order_product.model', 'oc_order_product.quantity', 'oc_order_product.price', 'oc_order.currency_value');
    },
    itemsToDb: function (element){
        db('order_items').where(function (){
            this.where('order_id', element['order_id'])
                .andWhere('sku', element['model'])
        })
            .update({
                quantity: element['quantity'],
                price: element['price']
            })
            .then(function (row){
                if (!row){
                    return db('order_items').insert({
                        'order_id': element['order_id'],
                        'sku': element['model'],
                        'quantity': element['quantity'],
                        'price': element['price']
                    })
                        .catch(function (err){
                            console.log(err);
                        })
                }
            })
            .catch(function (err){
                console.log(err);
            })
    }
};