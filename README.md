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
    ctx.succeed(data, 201);
    
    // Fail
    ctx.fail(message, 404);

    // Done
    ctx.done(err, data);
};
```

## Methods

### constructor(context[, options])

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

### fail(message[, status])

The fail method will take whatever status and message is passed to it and convert it to an error that is easily machine parseable and human readable. Converting it to an error has several advantages for Cloudwatch logs and API Gateway responses. 

#### Arguments

1. __message__ (_String | Object | Array | Function | Error_): Takes any value passed to it and converts it to a string that is included in the error message. 
2. [__status__] ](_Number_): The number of the status code. It will be converted to the text name in the actual error message. See the [status codes](#status-codes) below for the currently supported statuses. If not provided it will use the `defaultError` status code.

### succeed(data[, status])

The fail method will take whatever status and message is passed to it and convert it to an error that is easily machine parseable and human readable. Converting it to an error has several advantages for Cloudwatch logs and API Gateway responses. 

#### Arguments

1. __data__ (_Any_): Takes any value passed and returns it as the payload for the Lambda function. 
2. [__status__] ](_Number_): The number of the status code. If not provided it will use the `defaulError` status code. The status code is only included in the log output, it is not included in the returned data.

### done(error[, data])
The `done` method is a standard Node style callback where the first parameter is returns as an error and the second returns successfully with the data passesd. The default status codes are used for error and success when using `done`.

#### Arguments
1. __error__ (_Non-null_): If a value other than `null` or `undefined` is passed the Lambda function will call [#fail](#fail) with the data passed.
2. __data__ (_Any_): Will call [#succeed](#succeed) with the data passed. Will only be triggered if the value of the error argument is `null` or `undefined`.

### log([type,]...)
Sugar for the `console.log` function. Behaves almost identically and used internally to allow for expansion of logging in the future. Currently it only looks for a __type__ option to determine what type of output the log should have.

#### Arguments
1. [__type__] \(_String_): Looks for either `log` or `error` as the first paramter and will print using that method. _Defaults to `log`_.
2. __...__ (_Any_): Accepts any number of comma separated arguments and prints them via the console.

## Status Codes 
All current status codes are supported. Please see [https://httpstatuses.com/](https://httpstatuses.com/) for information on when to use a specific status code.