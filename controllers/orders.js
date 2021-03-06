/**
 * Created by Code on 30.12.2016.
 */
var Promise = require('bluebird');
var orders = require('./../models/orders');
var goods = require('./../models/goods');

function assign(arr){
    var result = [];

    nextObj:
        for (var i = 0; i < arr.length; i++){
            var str = arr[i];
            for (var j = 0; j < result.length; j++){
                if (result[j]['sku'] == str['sku']){
                    Object.assign(result[j], str);
                    continue nextObj;
                }
            }
            result.push(str);
        }

    return result;
}

function getTotals(arr){
    arr.forEach(function (elem){
        elem['total'] = (elem['ocQuantity'] || 0) + (elem['promQuantity'] || 0);
        elem['inStock'] = (elem['quantity'] || 0) - elem['total'];
    });

    return arr;
}

module.exports = {
    orderProducts: function (){
        return Promise.join(goods.getIncomingGoods(), orders.getOcOrderItems(), orders.getPromOrderItems(), function (inGoods, oc, prom){
            return inGoods.concat(oc, prom);
        }).then(function (data){
            return assign(data);
        }).then(function (result){
            return getTotals(result);
        });
    },

    orderTotalSum: function (){
        return Promise.join(orders.getOrdersTotalSum('orders_from_oc', '5'), orders.getOrdersTotalSum('orders_from_prom', 'closed'), function (ocOrderTotalSum, promOrderTotalSum){
            var orderTotalSum = ocOrderTotalSum[0]['sum'] + promOrderTotalSum[0]['sum'];
            return [ocOrderTotalSum[0]['sum'], promOrderTotalSum[0]['sum'], orderTotalSum.toFixed(2)]
        })
    },

    orderGroupByDate: function (){
        return Promise.join(orders.getOrdersByMonth('orders_from_oc', '5'), orders.getOrdersByMonth('orders_from_prom', 'closed'), function (ocOrdersByMonth, promOrdersByMonth){
            return {
                oc: ocOrdersByMonth,
                prom: promOrdersByMonth
            }
        })
    }
};