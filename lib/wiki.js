var follow = require('follow');


exports.init = function (config, events) {
    if (!config.wiki) {
        return events.emit('error', 'wiki',
            'Missing wiki property in config'
        );
    }
    if (!config.wiki.db) {
        return events.emit('error', 'wiki',
            'Missing wiki.db property in config'
        );
    }
    if (!config.wiki.baseURL) {
        return events.emit('error', 'wiki',
            'Missing wiki.baseURL property in config'
        );
    }

    var opts = {
        db: config.wiki.db,
        include_docs: true,
        since: 'now'
    };

    events.emit('debug', 'wiki', 'starting follow');
    follow(opts, function (err, change) {
        if (err) {
            return events.emit('error', 'wiki', err);
        }
        var doc = change.doc;
        if (doc && doc.type === 'page') {
            var edit = doc.latest_change;
            var url = config.wiki.baseURL + '/' + encodeURIComponent(doc._id);
            var msg = '[wiki] ' + edit.user + ' updated ' + url;
            if (edit.comment) {
                msg += ' - ' + edit.comment;
            }
            events.emit('say', msg);
        }
    });
};
