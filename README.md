# aws-context-logger 
[![Build Status](https://travis-ci.org/jaymorrow/aws-context-logger.svg?branch=master)](https://travis-ci.org/jaymorrow/aws-context-logger) [![codecov.io](https://codecov.io/github/jaymorrow/aws-context-logger/coverage.svg?branch=master)](https://codecov.io/github/jaymorrow/aws-context-logger?branch=master) ![Dependencies](https://david-dm.org/jaymorrow/aws-context-logger.svg)

Consistent logging and output for AWS Lambda functions. Designed primarily for use with API Gateway this will also provide reliable logging and context output for any Lambda function.

## Installation

    npm install aws-context-logger --save

## Use

`aws-context-logger` creates three methods (_succeed_, _fail_, and _done_) that mimic the behavior of the provided Lambda context.

```js
var logger = require('aws-context-logger');

exports.handler = function (event, context) {
    var ctx = new logger(context);

    // Lambda code here...

    // Succeed
    ctx.succeed(201, data);
    
    // Fail
    ctx.fail(404, message);

    // Done
    ctx.done(err, data);
};
```

## Methods

### constructor(context [, options])

Instantiates a new logger. Use of the `new` keyword when using the constructor is optional.

#### Arguments

1. __context__: The context argument provided by the handler function.
2. [__options__] \(_Object_): Default status codes for success and error states. Used for the [done](#done) method as well as if status codes aren't provided to the [succeed](#succeed) or [fail](#fail) methods.
    * defaultSuccess: 200
    * defaultError: 500

```js
exports.handler = function (event, context) {
    var ctx = logger(context, {
        defaultSuccess: 201,
        defaultError: 404
    });
};
```

### fail([status, ] message)

The fail method will take whatever status and message is passed to it and convert it to an error that is easily machine parseable and human readable. Converting it to an error has several advantages for Cloudwatch logs and API Gateway responses. 

#### Arguments

1. [__status__] ](_Number_): The number of the status code. It will be converted to the text name in the actual error message. See the [status codes](#status-codes) below for the currently supported statuses. If not provided it will use the `defaulError` status code.
2. __message__ (_String | Object | Array | Function | Error_): Takes any value passed to it and converts it to a string that is included in the error message. 

### succeed([status, ] data)

The fail method will take whatever status and message is passed to it and convert it to an error that is easily machine parseable and human readable. Converting it to an error has several advantages for Cloudwatch logs and API Gateway responses. 

#### Arguments

1. [__status__] ](_Number_): The number of the status code. If not provided it will use the `defaulError` status code. The status code is only included in the log output, it is not included in the returned data.
2. __data__ (_Any_): Takes any value passed and returns it as the payload for the Lambda function. 

## Status Codes 
The currently supported (2015-11-24) Method Response statuses from [AWS API Gateway](https://aws.amazon.com/api-gateway/).

### 2×× Success
* [__200__](https://httpstatuses.com/200): OK
* [__201__](https://httpstatuses.com/201): Created
* [__202__](https://httpstatuses.com/202): Accepted
* [__203__](https://httpstatuses.com/203): Non-authoritative Information
* [__204__](https://httpstatuses.com/204): No Content
* [__205__](https://httpstatuses.com/205): Reset Content
* [__206__](https://httpstatuses.com/206): Partial Content

### 3×× Redirection
* [__300__](https://httpstatuses.com/300): Multiple Choices
* [__301__](https://httpstatuses.com/301): Moved Permanently
* [__302__](https://httpstatuses.com/302): Found
* [__303__](https://httpstatuses.com/303): See Other
* [__304__](https://httpstatuses.com/304): Not Modified
* [__305__](https://httpstatuses.com/305): Use Proxy

### 4×× Client Error
* [__400__](https://httpstatuses.com/400): Bad Request
* [__401__](https://httpstatuses.com/401): Unauthorized
* [__402__](https://httpstatuses.com/402): Payment Required
* [__403__](https://httpstatuses.com/403): Forbidden
* [__404__](https://httpstatuses.com/404): Not Found
* [__405__](https://httpstatuses.com/405): Method Not Allowed
* [__406__](https://httpstatuses.com/406): Not Acceptable
* [__407__](https://httpstatuses.com/407): Proxy Authentication Required
* [__408__](https://httpstatuses.com/408): Request Timeout
* [__409__](https://httpstatuses.com/409): Conflict
* [__410__](https://httpstatuses.com/410): Gone
* [__411__](https://httpstatuses.com/411): Length Required
* [__412__](https://httpstatuses.com/412): Precondition Failed
* [__413__](https://httpstatuses.com/413): Payload Too Large
* [__414__](https://httpstatuses.com/414): Request-URI Too Long
* [__415__](https://httpstatuses.com/415): Unsupported Media Type
* [__416__](https://httpstatuses.com/416): Requested Range Not Satisfiable
* [__417__](https://httpstatuses.com/417): Expectation Failed

### 5×× Server Error
* [__500__](https://httpstatuses.com/500): Internal Server Error
* [__501__](https://httpstatuses.com/501): Not Implemented
* [__502__](https://httpstatuses.com/502): Bad Gateway
* [__503__](https://httpstatuses.com/503): Service Unavailable
* [__504__](https://httpstatuses.com/504): Gateway Timeout
* [__505__](https://httpstatuses.com/505): HTTP Version Not Supported