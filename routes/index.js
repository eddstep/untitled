var express = require('express');
var router = express.Router();

var controller = require('./../controllers/controllerOrderParse');

router.get('/', controller.parseOrders, controller.parseOrderProducts, function (req, res){
    res.end();
});

module.exports = router;
