/**
 * Created by dani on 29-03-2017.
 */

var Services = require('../../../services');
// var UserService = Services.UserService;

var apiRoutes = {
    rgbStrip		: require('./rgb_strip'),

    /*
    authHandler: function(requiredFields) {
        return 	function(req, res, next) {
            req.auth_key = req.header('auth_key');
            UserService.findUserBySessionId(req.auth_key).then(function(user) {
                if (!user || false) return next( new Error('No user for given auth_key') );

                req.authUser = user;
                console.log('Auth user: ', user._id, 'name: ', user.name);
                next();
            }, function(err) {
                next(err);
            });
        };
    },

    */
    successHandler: function(req, res, next) {
        res.render = function(data) {
            res.status(200).send(data);
        };

        next();
    },
    errorHandler: function(err, req, res, next) {
        var code = 500;
        var msg = "An unknown error occurred processing your request. Please try again later.";
        if ( err ) {
            msg = err.message || msg;

            console.log(err);
            console.log(err.stack);
        }

        if (err.isPiRGBApiError) {
            code = err.code;
        }

        res.status(400).json({error: {code: code, msg: msg}});
    }
};


module.exports = function() {
    var express = require('express');
    var app = express();

    app.disable('etag');
    app.use(apiRoutes.successHandler);


    app.get('/', function(req, res) {res.send('Pi RGB API V1')});

    // user api
    app.get('/rgb_strip/on',											        apiRoutes.rgbStrip.turnOn);
    app.get('/rgb_strip/off',											        apiRoutes.rgbStrip.turnOff);
    app.get('/rgb_strip/on_off_status',											apiRoutes.rgbStrip.getOnOffStatus);

    app.get('/rgb_strip/brightness_status',										apiRoutes.rgbStrip.getBrightnessStatus);
    app.get('/rgb_strip/brightness/:brightness',											apiRoutes.rgbStrip.setBrightness);

    app.get('/rgb_strip/color_status',											apiRoutes.rgbStrip.getColorStatus);
    app.get('/rgb_strip/color/:color',											        apiRoutes.rgbStrip.setColor);


    app.use(apiRoutes.errorHandler);

    return app;
}();