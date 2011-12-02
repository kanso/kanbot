var follow = require('follow');


exports.init = function (config, events) {
    if (!config.repository) {
        return events.emit('error', 'repository',
            'Missing repository property in config'
        );
    }
    if (!config.repository.db) {
        return events.emit('error', 'repository',
            'Missing repository.db property in config'
        );
    }

    var opts = {
        db: config.repository.db,
        include_docs: true,
        since: 'now'
    };

    events.emit('debug', 'repository', 'starting follow');
    follow(opts, function (err, change) {
        if (err) {
            return events.emit('error', 'repository', err);
        }
        var doc = change.doc;
        if (doc && doc.type === 'package') {
            var msg = '[repository] ';
            if (doc._deleted) {
                msg += doc._id + ' unpublished';
            }
            else {
                msg += doc.submitted_by + ' updated ' + doc.name + ' ';
                msg += '(latest ' + doc.tags.latest + ')';
            }
            events.emit('say', msg);
        }
    });
};
