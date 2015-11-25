'use strict';

process.env.NODE_ENV = '';

var path = require('path');
var assert = require('assert');
var listener = require('../test-helpers/listener');

delete require.cache[path.resolve(__dirname, '..', 'index.js')];
var logger = require('../index');

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