#!/usr/bin/env node

var forever = require('forever');

forever.startDaemon(__dirname + '/../scripts/start.js', {
    max: 10,
    silent: false,
    options: [],
    killTree: true,
    logFile: __dirname + '/../kanbot.log',
    pidFile: __dirname + '/../kanbot.pid'
});


// vim: set filetype=javascript:
