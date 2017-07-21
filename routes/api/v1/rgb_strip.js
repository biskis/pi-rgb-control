/**
 * Created by dani on 18-07-2017.
 */
var Services = require('../../../services');
var RgbStripService = Services.RgbStripService;

module.exports.turnOn = function(req, res, next) {
    var res_value = RgbStripService.turnOn();
    res.render(res_value);
};
module.exports.turnOff = function(req, res, next) {
    var res_value = RgbStripService.turnOff();
    res.render(res_value);
};
module.exports.getOnOffStatus = function(req, res, next) {
    var res_value = RgbStripService.getOnOffStatus();
    res.render(res_value + "");
};

module.exports.getBrightnessStatus = function(req, res, next) {
    var res_value = RgbStripService.getBrightnessStatus();
    res.render(res_value);
};
module.exports.setBrightness = function(req, res, next) {
    var brightness = req.params.brightness;
    var res_value = RgbStripService.setBrightness(brightness);
    res.render(res_value);
};


module.exports.getColorStatus = function(req, res, next) {
    var res_value = RgbStripService.getColorStatus();
    res.render(res_value);
};

module.exports.setColor = function(req, res, next) {
    var color = req.params.color;
    console.log("set new color,", color);
    var res_value = RgbStripService.setColor(color);
    res.render(res_value);
};
