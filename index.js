'use strict';

var util = require('util');

// Supported AWS status codes as of 11/24/15
var STATUS_CODES = {
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non-authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported"
};
var typeRegex = /^(?:error|log)$/;

function Context(ctx, opts) {
    if (!(this instanceof Context)) {
        return new Context(ctx);
    }

    opts = opts || {};
    this.defaultSuccess = opts.defaultSuccess || 200;
    this.defaultError = opts.defaultError || 500;

    this.context = ctx;
    return this;
}

Context.prototype.fail = function(status, err) {
    var stack;

    if (!STATUS_CODES[status]) {
        err = status;
        status = this.defaultError;
    }

    if (err instanceof Error) {
        stack = err.stack;
        err = err.message;
    } else if (isObject(err)) {
        err = util.format('%j', err);
    } else if (typeof err !== 'string') {
        err = err.toString();
    }

    var consoleError = new ConsoleError(status, err, stack);
    var contextError = new ContextError(consoleError);

    this.log('error', consoleError);
    this.context.fail(contextError);
};

Context.prototype.succeed = function(status, data) {
    if (!STATUS_CODES[status]) {
        data = status;
        status = this.defaultSuccess;
    }

    this.log('%s: ', STATUS_CODES[status], data);
    this.context.succeed(data);
};

Context.prototype.done = function(err, data) {
    if (err) {
        return this.fail(err);
    }
    return this.succeed(data);
};

Context.prototype.log = process.env.NODE_ENV === 'test' ? noop : logger;

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function ContextError(err) {
    this.name = err.name;
    this.message = util.format('%s: %s', err.name, err.message);
    this.stack = '';
}
util.inherits(ContextError, Error);

function ConsoleError(status, message, stack) {
    this.name = STATUS_CODES[status];
    this.message = message;

    if (stack) {
        this.stack = stack;
    }
}
util.inherits(ConsoleError, Error);

function noop() {};

function logger() {
    var args = Array.prototype.slice.call(arguments);
    var type = 'log';

    try {
        var hasType = typeRegex.test(args[0]);

        if (hasType) {
            type = args.shift();
        }
    } catch(e) {}

    console[type].apply(console, args);
}

module.exports = Context;