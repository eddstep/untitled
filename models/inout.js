/**
 * Created by Code on 07.02.2017.
 */

var db = require('./../bin/knex');

module.exports = {
    dataQuery: function (){
        return db.raw('SELECT ig.sku, sum(ig.quantity*ig.price) as buysum, sum(ig.quantity) as buyq, sellsum, sellq FROM incoming_goods ig LEFT JOIN (SELECT sku, sum(quantity*price/exrate.rate) AS sellsum, sum(quantity) AS sellq FROM order_items it INNER JOIN (SELECT rate, oc.id FROM exchange_rate r LEFT JOIN orders_from_oc oc ON DATE(r.date) = DATE (oc.date) WHERE oc.state = 5 UNION ALL SELECT rate, prom.id FROM exchange_rate r RIGHT JOIN orders_from_prom prom ON DATE(r.date) = DATE (prom.date) WHERE prom.state = "closed") exrate ON it.order_id = exrate.id GROUP BY it.sku) sell ON ig.sku = sell.sku GROUP BY ig.sku');
    }
};

