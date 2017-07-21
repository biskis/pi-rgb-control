/**
 * Created by dani on 29-03-2017.
 */
var config = require("config");
var moment = require('moment-timezone');
var Gpio = require('pigpio').Gpio;

var ledRed = new Gpio(config.get('rgbStripPins.R'), {mode: Gpio.OUTPUT});
var ledGreen = new Gpio(config.get('rgbStripPins.G'), {mode: Gpio.OUTPUT});
var ledBlue = new Gpio(config.get('rgbStripPins.B'), {mode: Gpio.OUTPUT});


var PiRGBApiError = require('../errors');

var JsonDB = require('node-json-db');
var db = new JsonDB("piRgbControl", true, false);


var RgbStripService = {


    getOnOffStatus: function () {
        try {
            var data = db.getData("/color_on_status");
            if(data === "0" || data === "1") {
                return data + "";
            }
        } catch(error) {

        }
        return "0";
    },
    turnOn: function () {
        db.push("/color_on_status", "1");

        this.updateColor(); //Set color to what should be
        return "1";
    },
    turnOff: function(){
        db.push("/color_on_status", "0");

        //Set all colors to 0
        ledRed.pwmWrite(0);
        ledGreen.pwmWrite(0);
        ledBlue.pwmWrite(0);
        return "0";
    },



    getBrightnessStatus:function () {
        try {
            return Math.max(0, Math.min(100, parseInt(db.getData("/brightness_on_status")))) + "";
        } catch(error) {
            return "100";
        }
    },
    setBrightness:function (new_brightness) {
        db.push("/brightness_on_status", new_brightness + "");

        this.updateColor();
    },


    getColorStatus:function () {
        try {
            return db.getData("/color").replace("#", '');
        } catch(error) {
            return config.get("rgbStripDefaultColor");
        }
    },
    setColor: function(color_hex) {
        db.push("/color", "#" + color_hex.replace("#", '') + "");

        this.updateColor();
    },


    updateColor: function(){
        var color = "#" + this.getColorStatus();
        var brightness = parseInt(this.getBrightnessStatus());

        //Calculate color.
        rgb = this.hexToRgb(color);
        console.log("color hex: ", color, "RGB: ", rgb, "brightness: ", brightness);
        var new_r = parseInt(rgb['r'] * brightness / 100);
        var new_g = parseInt(rgb['g'] * brightness / 100);
        var new_b = parseInt(rgb['b'] * brightness / 100);

        console.log("update color on strip light to RGB: ", new_r, new_g, new_b);
        ledRed.pwmWrite(new_r);
        ledGreen.pwmWrite(new_g);
        ledBlue.pwmWrite(new_b);
    },






    hexToRgb: function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    },
    componentToHex: function(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    },
    rgbToHex: function(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

};

module.exports = RgbStripService;