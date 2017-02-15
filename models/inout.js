/**
 * Created by Code on 07.02.2017.
 */

var db = require('./../bin/knex');

module.exports = {
    dataQuery: function (){
        return db.raw('SELECT first.sku, first.goodname, first.sellq, first.sellp, first.sellsum, first.igsum, first.igq, first.sellsum - (first.igsum - first.difq * second.price) as debit, price FROM (SELECT ig.sku, sum(ig.quantity*ig.price) AS igsum, sum(ig.quantity) AS igq, sellsum, sellq, sellp, sum(ig.quantity)-sellq AS difq, good.goodname FROM incoming_goods ig LEFT JOIN (SELECT sku, sum(quantity*price/exrate.rate) AS sellsum, sum(quantity) AS sellq, price/exrate.rate AS sellp FROM order_items it INNER JOIN (SELECT rate, oc.id FROM exchange_rate r LEFT JOIN orders_from_oc oc ON DATE(r.date) = DATE (oc.date) WHERE oc.state = 5 UNION ALL SELECT rate, prom.id FROM exchange_rate r RIGHT JOIN orders_from_prom prom ON DATE(r.date) = DATE (prom.date) WHERE prom.state = "closed") exrate ON it.order_id = exrate.id GROUP BY it.sku) sell ON ig.sku = sell.sku LEFT JOIN (SELECT name AS goodname, sku FROM goods) good ON good.sku = ig.sku GROUP BY ig.sku) first, (SELECT * FROM (SELECT * FROM incoming_goods ORDER BY purchase_id DESC) max GROUP BY max.sku) second WHERE first.sku = second.sku');
    }
};

