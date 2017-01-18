/**
 * Created by Code on 11.12.2016.
 */
var fetch = require("node-fetch");
var Promise = require('bluebird');
var xml2js = Promise.promisifyAll(require('xml2js'));

var orderQueries = require('./../models/promOrderParse');

var parseStringAsync = xml2js.parseStringAsync;

function parsePromOrders(url){
    return fetch(url)
        .then(function (res){
            return res.text();
        }).then(function (text){
            return parseStringAsync(text)
        }).catch(function (err){
            return err.message;
        });
}

//TODO with generator like Promise.coroutine
function writeOrdersToDb(item){
    var prom_orders_products = [];

    for (var key in item){

        if (key === '$'){
            for (var key2 in item['$']){
                item[key2] = item['$'][key2];
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
                writeItemsToDb(prom_orders_products[i]);
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

    orderQueries.ordersToDb(item);
}

function writeItemsToDb(product){
    for(var key in product){
        if (Array.isArray(product[key])){
            product[key] = product[key].join('|');
        }
    }

    orderQueries.itemsToDb(product);
}

module.exports = function (){
    return Promise.resolve(parsePromOrders('https://my.parseProm.ua/cabinet/export_orders/xml/2424009?hash_tag=ddd24a3cf7d2b78a186489cbf6741885'))
        .then(function (data){
            if (typeof data === 'object'){
                data = data['orders']['order'];

                for (var i = 0; i < data.length; i++){
                    writeOrdersToDb(data[i]);
                }
        }

            return data;
        });
};