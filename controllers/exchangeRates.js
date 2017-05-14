/**
 * Created by Code on 02.02.2017.
 */
var db = require('./../bin/knex');
var fetch = require('node-fetch');

module.exports = {
    parseCurrentRate: function (url){
        fetch(url)
            .then(function (data){
                return data.json();
            })
            .then(function (jsonData){
                var current = jsonData[2]['sale'];
                return db('exchange_rate').insert({
                    date: new Date(),
                    rate: current
                })
            })
            .catch(function (err){
                console.log(err);
            });
    }
};
