/**
 * Created by Code on 07.02.2017.
 */
var inout = require('./../models/inout');

module.exports = {
    calcMoney: function (){
        return inout.dataQuery().then(function (data){
            return data[0];
        });
    }
};