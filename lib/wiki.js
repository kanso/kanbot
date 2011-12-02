var follow = require('follow');


exports.init = function (config, events) {
    if (!config.wiki) {
        throw new Error('Missing wiki property in config');
    }
    if (!config.wiki.db) {
        throw new Error('Missing wiki.db property in config');
    }
    if (!config.wiki.baseURL) {
        throw new Error('Missing wiki.baseURL property in config');
    }

    var opts = {
        db: config.wiki.db,
        include_docs: true,
        since: 'now'
    };

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
