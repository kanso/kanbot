var couchdb = require('./couchdb');



exports.init = function (config, events) {
    var db = couchdb(config.couchlog.db);
    events.on('irc::message', function (from, to, message) {
        // only save messages sent to channels, not PMs
        if (to[0] === '#') {
            exports.save(events, db, {
                type: 'message',
                sender: from,
                channel: to,
                message: message,
                time: new Date().getTime()
            });
        }
    });
    events.on('irc::topic', function (channel, topic, nick) {
        exports.save(events, db, {
            type: 'topic',
            channel: channel,
            topic: topic,
            by: nick,
            time: new Date().getTime()
        });
    });
    events.on('irc::join', function (channel, who) {
        exports.save(events, db, {
            type: 'join',
            channel: channel,
            who: who,
            time: new Date().getTime()
        });
    });
    events.on('irc::part', function (channel, who, reason) {
        exports.save(events, db, {
            type: 'part',
            channel: channel,
            who: who,
            reason: reason,
            time: new Date().getTime()
        });
    });
    events.on('irc::kick', function (channel, who, by, reason) {
        exports.save(events, db, {
            type: 'kick',
            channel: channel,
            who: who,
            by: by,
            reason: reason,
            time: new Date().getTime()
        });
    });
    events.on('irc::quit', function (who, reason, channels) {
        exports.save(events, db, {
            type: 'quit',
            channels: channels,
            who: who,
            reason: reason,
            time: new Date().getTime()
        });
    });
};

exports.save = function (events, db, doc) {
    db.save(null, doc, function (err, doc) {
        if (err) {
            events.emit('error', 'couchlog', err);
        }
        else {
            events.emit('debug', 'couchlog', 'saved doc ' + doc_.id);
        }
    });
};
