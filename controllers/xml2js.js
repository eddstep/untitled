/**
 * Created by Code on 06.12.2016.
 */
var xml2js = require('xml2js');
var fs = require('fs');

var parser = new xml2js.Parser();

function parseXmlFile(url, cb){
    fs.readFile(url, function(err, data){
        parser.parseString(data, function(err, obj){
            cb(obj);
        })
    });
}

module.exports.parseXmlFile = parseXmlFile;