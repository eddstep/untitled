/**
 * Created by Code on 02.02.2017.
 */
var db = require('./../bin/knex');
var fetch = require('node-fetch');
var app = require('./../app');

function getDateAgo(date, days){
    date.setDate(date.getDate() - days);
    return date;
}

function formatDate(date){

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear() % 100;
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.20' + yy;
}

function parseRates(date, days){

    date = getDateAgo(date, days);

    var vDate = formatDate(date, days);
    var url = 'https://api.privatbank.ua/p24api/exchange_rates?json&date=' + vDate;
    return fetch(url)
        .then(function (result){
            return result.json();
        })
        .then(function (data){
            return data['exchangeRate'][15]['saleRate'];
        })
        .then(function (cur){
            return db('exchange_rate').insert({
                date: date,
                rate: cur
            });
        })
        .catch(function (err){
            console.log(err);
        });
}

for (var i = 3; i < 232; i++){
    parseRates(new Date(), i);
}

app.use(function (req, res, next){
    console.log('app.use');
});
