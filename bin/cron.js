/**
 * Created by Code on 19.03.2017.
 */
var cron = require('node-cron');
var rate = require('./../controllers/exchangeRates');

var task = cron.schedule('* * 10 * *', function (){
    rate.parseCurrentRate('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
}, false);

module.exports = task;