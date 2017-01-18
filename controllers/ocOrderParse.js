/**
 * Created by Code on 23.12.2016.
 */
var Promise = require('bluebird');
var orderQueries = require('./../models/ocOrderParce');

function editData(obj){
    obj.forEach(function (elem){
        switch(elem['shipping_code']){
            case 'flatinode.flatinode':
            case 'xshipping.xshipping2':
                elem['total'] = elem['total'] - 2;
                elem['deliveryCost'] = (2 * elem['currency_value']).toFixed(2);
                break;
            case 'xshipping.xshipping1':
                elem['total'] = elem['total'] - 0.5;
                elem['deliveryCost'] = (0.5 * elem['currency_value']).toFixed(2);
                break;
            default:
                elem['deliveryCost'] = 0;
        }

        elem['priceUAH'] = (elem['total'] * elem['currency_value']).toFixed(2);
        delete elem['total'];
        delete elem['currency_value'];
    });

    return obj;
}

var parse = {
    parseOrders: function (){
        return Promise.resolve(orderQueries.getOrdersFromOc())
        .then(function (data){
            var modifiedData = editData(data);
            modifiedData.forEach(function (elem){
                return orderQueries.ordersToDb(elem);
            });
        });
    },

    parseOrderProducts: function (){
        return Promise.resolve(orderQueries.getOrderItemsFromOc())
        .then(function (data){
            data.forEach(function (element){
                element['price'] = (element['price'] * element['currency_value']).toFixed(2);

                return orderQueries.itemsToDb(element);
            });
        })
    }
};

module.exports = function (){
    Promise.all([parse.parseOrders(), parse.parseOrderProducts()]);
};