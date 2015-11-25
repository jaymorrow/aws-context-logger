'use strict';

process.env.NODE_ENV = 'test';

var assert = require('assert');
var logger = require('../index');
var handler = require('../test-helpers/handler');

describe('Failing tests', function() {
    describe('with error', function() {
        it('should return \'Not Found\'', function(done) {
            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                var err = new Error('Does not exist');
                ctx.fail(404, err);
            });

            var errorMessage = 'Not Found: Does not exist';
            var errorType = 'Not Found';
            lambda({}, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });

    describe('with object', function() {
        it('should return \'Unauthorized\'', function(done) {
            var err = {
                one: 1,
                two: {
                    three: 3
                }
            };

            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.fail(401, event);
            });

            var errorMessage = 'Unauthorized: ' + JSON.stringify(err);
            var errorType = 'Unauthorized';
            lambda(err, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });

    describe('with function', function() {
        it('should return \'Not Implemented\'', function(done) {
            var err = function myErr() {};

            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.fail(501, event);
            });

            var errorMessage = 'Not Implemented: ' + err.toString();
            var errorType = 'Not Implemented';
            lambda(err, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });

    describe('with string', function() {
        it('should return \'Not Implemented\'', function(done) {
            var err = 'My error';

            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.fail(501, event);
            });

            var errorMessage = 'Not Implemented: ' + err;
            var errorType = 'Not Implemented';
            lambda(err, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });

    describe('using done', function(done) {
        it('should return \'Internal Server Error\'', function(done) {
            var err = {
                one: 1,
                two: {
                    three: 3
                }
            };

            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.done(event);
            });

            var errorMessage = 'Internal Server Error: ' + JSON.stringify(err);
            var errorType = 'Internal Server Error';
            lambda(err, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });
});

describe('Succeeding tests', function() {
    it('should return object', function(done) {
        var lambda = handler(function(event, context) {
            var ctx = logger(context);
            ctx.succeed(201, event);
        });

        var expected = {
            item: 1
        };
        lambda(expected, function(actual) {
            actual = JSON.parse(actual);

            assert.deepEqual(actual, expected);
            done();
        });
    });

    describe('using done', function() {
        it('should return an object', function(done) {
            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.done(null, event);
            });

            var expected = {
                item: 1
            };
            lambda(expected, function(actual) {
                actual = JSON.parse(actual);

                assert.deepEqual(actual, expected);
                done();
            });
        });
    });
});