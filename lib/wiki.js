var follow = require('follow'),
    Bitly = require('bitly');


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
    if (!config.bitly.username) {
        throw new Error('Missing bitly.username property in config');
    }
    if (!config.bitly.api_key) {
        throw new Error('Missing bitly.api_key property in config');
    }

    var opts = {
        db: config.wiki.db,
        include_docs: true,
        since: 'now'
    };

    var bitly = new Bitly(config.bitly.username, config.bitly.api_key);

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
            var diffurl = config.wiki.baseURL + '/_history/' +
                          encodeURIComponent(doc._id) + '/' + edit._id;
            bitly.shorten(diffurl, function(err, response) {
                if (err) {
                    return events.emit('error', 'wiki', err);
                }
                var short_url = response.data.url
                msg += ' (diff: ' + short_url + ')';
                events.emit('say', msg);
            });
        }
    });
};
