'use strict';

process.env.NODE_ENV = '';

var path = require('path');

var cachePath = path.resolve(__dirname, '..', 'index.js');
console.log(cachePath);
if (process.env.CI_ENV === 'travis') {
    cachePath = '/home/travis/build/jaymorrow/aws-context-logger/index.js';
}
delete require.cache[cachePath];

var assert = require('assert');
var logger = require('../index');
var listener = require('../test-helpers/listener');

describe('Using logger', function() {
    var ctx = logger();
    it('should fail', function (done) {
        assert.fail(1, 1);
        done();
    });

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