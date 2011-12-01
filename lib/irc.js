var irc = require('irc');


exports.init = function (config, events) {
    var server = config.irc.server;
    var nick = config.irc.nick;
    var client = new irc.Client(server, nick, config.irc);

    events.on('say', function (to, message) {
        if (message === undefined) {
            message = to;
            to = config.irc.channels;
        }
        if (Array.isArray(to)) {
            to.forEach(function (t) {
                events.emit('debug', 'irc', 'saying to ' + t + ': ' + message);
                client.say(t, message);
                events.emit('irc::say', nick, t, message);
            });
        }
        else {
            events.emit('debug', 'irc', 'saying to ' + to + ': ' + message);
            client.say(to, message);
            events.emit('irc::say', nick, to, message);
        }
    });

    client.addListener('message', function (from, to, message) {
        events.emit('debug', 'irc', from + ' => ' + to + ': ' + message);
        events.emit('irc::message', from, to, message);
    });
    client.addListener('topic', function (channel, topic, by) {
        events.emit('debug', 'irc',
            'topic changed in ' + channel + ' by ' + by + ': ' + topic
        );
        events.emit('irc::topic', channel, topic, by);
    });
    client.addListener('join', function (channel, who) {
        if (who === nick) {
            events.emit('info', 'irc', 'joined ' + channel);
        }
        else {
            events.emit('debug', 'irc', who + ' joined ' + channel);
        }
        events.emit('irc::join', channel, who);
    });
    client.addListener('part', function (channel, who, reason) {
        events.emit('debug', 'irc', who + ' left ' + channel);
        events.emit('irc::part', channel, who, reason);
    });
    client.addListener('kick', function (channel, who, by, reason) {
        events.emit('debug',
            'irc', by + ' kicked ' + who + ' from ' + channel + ': ' + reason
        );
        events.emit('irc::kick', channel, who, by, reason);
    });
    client.addListener('quit', function (who, reason, channels) {
        events.emit('debug', 'irc', who + ' quit');
        events.emit('irc::quit', who, reason, channels);
    });
    client.addListener('pm', function (from, message) {
        events.emit('info', 'irc', 'pm from: ' + from + ': ' + message);
        events.emit('irc::pm', from, message);
    });
    client.addListener('connect', function () {
        events.emit('info', 'irc', 'connected to ' + server + ' as ' + nick);
        events.emit('irc::connect', server, nick);
    });
    client.addListener('error', function (message) {
        events.emit('error', 'irc', message);
    });
    client.addListener('registered', function (message) {
        events.emit('info', 'irc', 'registered');
    });
};
