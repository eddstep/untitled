/**
 * Created by Code on 29.01.2017.
 */
var dev = require('knex')({
    client: 'mysql',
    connection: {
        host: 'movik147.coolvds.com',
        user: 'root',
        password: 'dE3X7lC9',
        database: 'dev'
    },
    pool: {min: 0, max: 10},
    useNullAsDefault: true
});
var express = require('express');
var router = express.Router();
var goods = require('./../models/goods');

var ocList, list = [];

router.use(function (req, res, next){
    goods.getIncomingGoods().then(function (data){
        list = data;
        next();
    })
        .catch(next);
});

router.use(function (req, res, next){
    dev('product')
        .where('status', '=', '1')
        .join('product_description', 'product.product_id', '=', 'product_description.product_id')
        .select('product.model', 'product_description.name')
        .orderBy('product.model')
        .then(function (data){
            ocList = data;
            next();
        })
        .catch(next);
});

router.use('/', function (req, res, next){

    var newArr = [];
    var id = 0;

    out:
        for (var k = 0; k < ocList.length; k++){
            for (var i = 0; i < list.length; i++){
                if (ocList[k]['model'] == list[i]['sku']){
                    continue out;
                }
            }
            ;
            ocList[k]['id'] = ++id;
            newArr.push(ocList[k]);
        }

    res.render('test', {
        ocist: newArr
    });
});

module.exports = router;
