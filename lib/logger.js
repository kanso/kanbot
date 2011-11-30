/**
 * Module dependencies
 */

var util = require('util');

/**
 * The level to log at, change this to alter the global logging level.
 * Possible options are: error, warning, info, debug. Default level is info.
 */
exports.level = 'info';


exports.init = function (config, events) {
    if (config.logger) {
        exports.level = config.logger.level || exports.level;
    }
    console.log('Log level: ' + exports.level);
    events.on('error', exports.error);
    events.on('info', exports.info);
    events.on('debug', exports.debug);
    events.on('warning', exports.warning);
};


/**
 * Wraps some ANSI codes around some text.
 */
var wrap = function (code, reset) {
    return function (str) {
        return "\x1B[" + code + "m" + str + "\x1B[" + reset + "m";
    };
};

/**
 * ANSI colors and styles used by the logger module.
 */
var bold    = exports.bold    = wrap(1, 22);
var red     = exports.red     = wrap(31, 39);
var green   = exports.green   = wrap(32, 39);
var cyan    = exports.cyan    = wrap(36, 39);
var yellow  = exports.yellow  = wrap(33, 39);
var magenta = exports.magenta = wrap(35, 39);

/**
 * Executes a function only if the current log level is in the levels list
 *
 * @param {Array} levels
 * @param {Function} fn
 */

var forLevels = function (levels, fn) {
    return function () {
        for (var i = 0; i < levels.length; i++) {
            if (levels[i] === exports.level) {
                return fn.apply(this, arguments);
            }
        }
    };
};

/**
 * Logs debug messages, using util.inspect to show the properties of objects
 * (logged for 'debug' level only)
 */

exports.debug = forLevels(['debug'], function (label, val) {
    if (val === undefined) {
        val = label;
        label = null;
    }
    if (typeof val !== 'string') {
        val = util.inspect(val);
    }
    if (label && val) {
        console.log(magenta(label + ' ') + val);
    }
    else {
        console.log(label);
    }
});

/**
 * Logs info messages (logged for 'info' and 'debug' levels)
 */

exports.info = forLevels(['info', 'debug'], function (label, val) {
    if (val === undefined) {
        val = label;
        label = null;
    }
    if (typeof val !== 'string') {
        val = util.inspect(val);
    }
    if (label) {
        console.log(cyan(label + ' ') + val);
    }
    else {
        console.log(val);
    }
});

/**
 * Logs warnings messages (logged for 'warning', 'info' and 'debug' levels)
 */

exports.warning = forLevels(['warning', 'info', 'debug'], function (label, msg) {
    console.log(yellow(bold(label + ': ') + msg));
});

/**
 * Logs error messages (always logged)
 */

exports.error = function (label, err) {
    var msg = err.message || err.error || err;
    console.log(red(bold(label + ': ') + msg));
};

/**
 * Log uncaught exceptions in the same style as normal errors.
 */

process.on('uncaughtException', function (err) {
    exports.error(err.stack || err);
});
