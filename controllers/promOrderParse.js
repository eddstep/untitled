/**
 * Created by Code on 11.12.2016.
 */
var db = require('./../bin/knex');
var xml2js = require('.//xml2js');

var prom_orders = [];

function cb(obj){
    prom_orders = obj['orders']['order'];
}

function promOrderParse(item){
    var prom_orders_products = [];

    for (var key in item){

        if (key === '$'){
            for (var key2 in item['$']){
                (item[key2] = item['$'][key2]);
            }
            delete item['$'];continue;
        }

        if (key === 'index'){
            item['postCode'] = item['index'];
            delete item['index'];
        }

        if (key === 'items'){
            prom_orders_products = item['items'][0]['item'];

            for(var i = 0; i < prom_orders_products.length; i++){
                prom_orders_products[i]['order_id'] = item['id'];
                cbForItem(prom_orders_products[i]);
            }

            delete item['items'];
        }

        if (Array.isArray(item[key])){
            if(key === 'items'){
                continue;
            }
            item[key] = item[key].join('');
        }

        if (key === 'date'){
            var rev = item['date'].split(' ');
            rev[0] = rev[0].split(".").reverse().join(".");
            item['date'] = rev.join(' ');
        }
    }

    db('orders_from_prom').where('id', item['id'])
        .update(item)
        .then(function (row){
            if(!row){
                return db('orders_from_prom').insert(item)
                    .catch(function (err){
                        console.log('insert error: ' + err);
                    })}
        })
        .catch(function (err){
            console.log('update error: ' + err);
        });
}

function cbForItem(product){
    for(var key in product){
        if (Array.isArray(product[key])){
            product[key] = product[key].join('|');
        }
    }

    db('order_items').where(function (){
        this.where('order_id', product['order_id'])
            .andWhere('sku', product['sku'])
    })
    .update({
        quantity: product['quantity'],
        price: product['price']
    })
    .then(function (row){
        if(!row){
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

module.exports = {
    getFromXml: function(req, res, next){
        xml2js.parseXmlFile('../NonProjectFiles/orders_from_prom.xml', cb);
        next();
    },

    parse: function (req, res, next){
        for(var i = 0; i < prom_orders.length; i++){
            promOrderParse(prom_orders[i]);
        }
    next();
    }
}