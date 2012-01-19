var markov = require('markov');
var fs = require('fs');


exports.init = function (config, events) {
    events.emit('debug', 'markov', 'initializing markov plugin');

    if (!config.markov) {
        return events.emit('error', 'markov',
            'Missing markov property in config'
        );
    }
    if (!config.irc.nick) {
        return events.emit('error', 'markov',
            'Missing irc.nick property in config'
        );
    }

    var m = markov(1);

    events.emit('info', 'markov', 'reading markov seed data');

    var s = fs.createReadStream(__dirname + '/../' + config.markov);
    m.seed(s, function (err) {
        if (err) {
            return events.emit('error', 'markov', err);
        }
        events.emit('info', 'markov', 'markov seed data loaded');

        var nick = config.irc.nick;
        events.on('irc::message', function (from, to, message) {
            if (new RegExp('^\\s*' + nick + '[\\s:]').test(message)) {
                events.emit('debug', 'markov', 'message @ bot');
                var res = m.respond(message.toString()).join(' ');
                events.emit('debug', 'markov', 'response: ' + res);
                events.emit('say', res);
            }
            else {
                events.emit('debug', 'markov', 'message not @ bot');
            }
        });
    });

};
