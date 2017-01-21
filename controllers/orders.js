/**
 * Created by Code on 30.12.2016.
 */
var Promise = require('bluebird');
var orders = require('./../models/orders');

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

module.exports = {
    orderProducts: function (){
        return Promise.join(orders.getOcOrderItems(), orders.getPromOrderItems(), function (oc, prom){
            return oc.concat(prom);
        }).then(function (data){
            return assign(data);
        });
    }
};