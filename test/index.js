process.env.NODE_ENV = 'test';

var assert = require('assert');
var logger = require('../index');

function createContext(complete) {
    return {
        fail: function (err) {
            var ret = {
                errorMessage: err.toString()
            };

            if (err instanceof Error) {
                ret.errorMessage = err.message;
                ret.errorType = err.name;
                ret.stackTrace = err.stack;
            }

            return complete(JSON.stringify(ret, null, 4));
        },
        succeed: function (data) {
            return complete(JSON.stringify(data, null, 4));
        }
    };
}

function handler(fn) {
    return function (data, callback) {
        return fn(data, createContext(callback));
    };
}

describe('Failing tests', function () {
    describe('with error', function () {
        it('should return \'Not Found\'', function (done) {
            var lambda = handler(function (event, context) {
                var ctx = logger(context);
                var err = new Error('Does not exist');
                ctx.fail(404, err);
            });

            var errorMessage = 'Not Found: Does not exist';
            var errorType = 'Not Found';
            lambda({}, function (actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });

    describe('with object', function () {
        it('should return \'Unauthorized\'', function (done) {
            var err = {one: 1, two: {three: 3}};

            var lambda = handler(function (event, context) {
                var ctx = logger(context);
                ctx.fail(401, event);
            });

            var errorMessage = 'Unauthorized: ' + JSON.stringify(err);
            var errorType = 'Unauthorized';
            lambda(err, function (actual) {
                actual = JSON.parse(actual);

                assert.equal(actual.errorMessage, errorMessage);
                assert.equal(actual.errorType, errorType);
                assert.equal(actual.stackTrace, '');
                done();
            });
        });
    });
});