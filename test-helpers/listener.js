'use strict';

module.exports = function listener (callback) {
    var stdout = process.stdout.write;
    var stderr = process.stderr.write;

    process.stdout.write = function(string) {
        callback('log', string);
    };

    process.stderr.write = function(string) {
        callback('error', string);
    }

    return function() {
        process.stdout.write = stdout;
        process.stderr.write = stderr;
    };
};