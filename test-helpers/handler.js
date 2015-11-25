'use strict';

function createContext(complete) {
    return {
        fail: function(err) {
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
        succeed: function(data) {
            return complete(JSON.stringify(data, null, 4));
        }
    };
}

function handler(fn) {
    return function(data, callback) {
        return fn(data, createContext(callback));
    };
}

module.exports = handler;