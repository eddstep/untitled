/**
 * Created by Code on 11.12.2016.
 */
var express = require('express');
var router = express.Router();

var prom = require('./../controllers/promOrderParse');

/* GET parse page. */
router.use('/', prom.getFromXml, prom.parse, function(req, res) {
    res.send('done');
});
module.exports = router;