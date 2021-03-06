'use strict';

var util = require('util');

// Supported AWS status codes as of 11/24/15
var STATUS_CODES = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    207: 'Multi-Status',
    208: 'Already Reported',
    226: 'IM Used',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    418: 'I\'m a teapot',
    421: 'Misdirected Request',
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    499: 'Client Closed Request',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    510: 'Not Extended',
    511: 'Network Authentication Required',
    599: 'Network Connect Timeout Error'
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

Context.prototype.fail = function(err, status) {
    if (!status || typeof status !== 'number') {
        status = this.defaultError;
    }

    var stack = '';
    if (err instanceof Error) {
        stack = err.stack;
        err = err.message;
    }

    if (typeof err === 'function') {
        err = err.toString();
    }

    this.log('error', '%d - %s\n%s\n', status, getStatus(status), JSON.stringify(err), stack);

    if (isObject(err) || Array.isArray(err)) {
        err = JSON.stringify(err);
    }

    this.context.fail(new ContextError(status, err));
};

Context.prototype.succeed = function(data, status) {
    if (!status || typeof status !== 'number') {
        status = this.defaultSuccess;
    }

    if (typeof data === 'function') {
        data = data.toString();
    }

    this.log('%d - %s:\n', status, getStatus(status), JSON.stringify({
        ReturnedValue: data
    }));
    this.context.succeed(data);
};

Context.prototype.done = function(err, data) {
    if (err !== null && typeof err !== 'undefined') {
        return this.fail(err);
    }

    return this.succeed(data);
};

Context.prototype.log = process.env.NODE_ENV === 'test' ? noop : logger;

function isObject(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]';
}

function ContextError(status, message) {
    this.name = getStatus(status);
    this.message = util.format('%d: %s', status, message);
    this.stack = '';
}
util.inherits(ContextError, Error);

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

function getStatus(status) {
    return STATUS_CODES[status] || 'Unknown';
}

module.exports = Context;