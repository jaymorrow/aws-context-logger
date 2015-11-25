'use strict';

process.env.NODE_ENV = '';

// Delete cache to change logging function
delete require.cache['/Users/jmorrow/Projects/context-logger/index.js'];

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