var events = require('events');


exports.init = function (config) {
    var ev = new events.EventEmitter();

    // load modules
    require('./logger').init(config, ev);
    require('./markov').init(config, ev);
    require('./couchlog').init(config, ev);
    require('./irc').init(config, ev);
    require('./wiki').init(config, ev);
    require('./repository').init(config, ev);

    ev.emit('loaded');
};
