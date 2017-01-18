/**
 * Created by Code on 30.12.2016.
 */
var orders = require('./../models/orders');

module.exports = {
    orderProducts: function (){
        return Promise.resolve(orders.getOrderItems());
    }
};