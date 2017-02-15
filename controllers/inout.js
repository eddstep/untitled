/**
 * Created by Code on 07.02.2017.
 */
var inout = require('./../models/inout');

function getArrAverage(arr){
    var average = 0;

    arr.forEach(function (elem){
        if (elem > 0 && isFinite(elem)){
            average += elem;
        }
    });
    var av = average / arr.length;

    return av;
}

module.exports = {
    calcMoney: function (){
        return inout.dataQuery()
            .then(function (data){
            return data[0];
            })
            .then(function (result){
                var totals = {
                    'sellTotal': 0,
                    'buyTotal': 0,
                    'earnings': 0,
                    'avPercent': 0
                };
                var arr = [];

                result.forEach(function (elem){
                    totals['sellTotal'] += elem['sellsum'];
                    totals['buyTotal'] += elem['igsum'];
                    elem['percent'] = ((elem['sellp'] - elem['price']) * 100 / elem['price']);
                    if (elem['percent']){
                        arr.push(elem['percent'])
                    }
                    totals['earnings'] += elem['debit'];
                });
                totals['avPercent'] = getArrAverage(arr);

                return {
                    products: result,
                    total: totals
                };
            })
    }
};