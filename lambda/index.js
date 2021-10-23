const service = require('./src/service');
const { addLoggers, loggerAspectFactory } = require('./src/logger');
const get = require('lodash').get;
const AOP = require('./src/AOP');

const main = async (event, context) => {
    await service(event, context);
    
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };;
};


// code below will only execute on lambda cold-start

// must add loggers before creating aspects, otherwise error will be thrown
// below simultaneously creates and adds Winston loggers to a default Winston container
addLoggers(['default', 'service'], {
    namespace: 'lambda::logger::test',
    environment: process.env.NODE_ENV,
    aws_request_id: get(context, 'awsRequestId'),
    labels: {
        body: JSON.parse(get(event, 'body'))
    }
});

// creates logger Aspects to be used on Advice defs
const serviceLoggerAspect = loggerAspectFactory('service', 'info');
const defaultLoggerAspect = loggerAspectFactory('default', 'info');

// inject Aspects 
AOP.inject(this, defaultLoggerAspect, 'around', 'method', main);
AOP.inject(service, serviceLoggerAspect, 'around', 'methods');

exports.handler = async (event, context) => await main(event, context);
