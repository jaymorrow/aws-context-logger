'use strict';

process.env.NODE_ENV = '';

var cachePath = '/Users/jmorrow/Projects/context-logger/index.js';
if (process.env.CI_ENV === 'travis') {
    console.log('NODE_ENV', process.env.NODE_ENV);
    console.log(Object.keys(require.cache));
    cachePath = '/home/travis/build/jaymorrow/context-logger/index.js';
}
delete require.cache[cachePath];

var assert = require('assert');
var logger = require('../index');
var listener = require('../test-helpers/listener');

describe('Using logger', function() {
    var ctx = logger();

    it('should log an error', function (done) {
        var expectedType = 'error';
        var expectedString = 'my error';
        var quiet = listener(function (type, string) {
            quiet();

            assert.equal(type, expectedType);
            assert.ok(string.indexOf(expectedString) > -1);
            done();
        });

        ctx.log(expectedType, expectedString);
    });

    it('should be a regular log', function (done) {
        var expectedString = 'my log';
        var quiet = listener(function (type, string) {
            quiet();

            assert.equal(type, 'log');
            assert.ok(string.indexOf(expectedString) > -1);
            done();
        });

        ctx.log(expectedString);
    });
});