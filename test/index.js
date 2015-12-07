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
                ctx.fail(err, 404);
            });

            var errorMessage = '404: Does not exist';
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
                ctx.fail(event, 401);
            });

            var errorMessage = '401: ' + JSON.stringify(err);
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
                ctx.fail(event, 501);
            });

            var errorMessage = '501: ' + err.toString();
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
                ctx.fail(event, 501);
            });

            var errorMessage = '501: ' + err;
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

            var errorMessage = '500: ' + JSON.stringify(err);
            var errorType = 'Internal Server Error';
            lambda(err, function(actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });

        it('should return an error on \'false\'', function (done) {
            var err = false;

            var lambda = handler(function(event, context) {
                var ctx = logger(context);
                ctx.done(event, context);
            });

            var errorMessage = '500: false';
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
            ctx.succeed(event, 201);
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

    it('should return a stringified function', function(done) {
        var lambda = handler(function(event, context) {
            var ctx = logger(context);
            ctx.succeed(event, 201);
        });

        var expected = function test() {};
        lambda(expected, function(actual) {
            actual = JSON.parse(actual);

            assert.deepEqual(actual, expected.toString());
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

describe('Unkown status', function () {
    it('should return \'Unknown\'', function (done) {
        var err = 'My Error'
        var lambda = handler(function (event, context) {
            var ctx = logger(context);
            ctx.fail(event, 650);
        });

        var errorMessage = '650: ' + err;
        lambda(err, function (actual) {
            actual = JSON.parse(actual);

            assert.equal(actual.errorMessage, errorMessage);
            assert.equal(actual.errorType, 'Unknown');
            assert.equal(actual.stackTrace, '');
            done();
        });
    });
});