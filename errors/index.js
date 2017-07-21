var util = require('util');
function PiRGBApiError(code, message) {
    Error.call(this);
    Error.captureStackTrace(this, arguments.callee);

    this.message = message;
    this.code = code;

    this.name = 'PiRGBApiError';
    this.isPiRGBApiError = true;
}

PiRGBApiError.prototype.__proto__ = Error.prototype;

module.exports = {
    Unknown: function() {
        return new PiRGBApiError(0, 'An unknown error occurred processing your request. Please try again later.');
    },
    InvalidColor: function() {
        return new PiRGBApiError(2, 'Invalid color.');
    },
    InvalidBrightness: function() {
        return new PiRGBApiError(  3, 'Invalid brightness.');
    },
    InvalidValue: function() {
        return new PiRGBApiError(  4, 'Invalid value.');
    }
};
