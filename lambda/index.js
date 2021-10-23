const service = require('./src/service');
const { addLoggers, loggerAspectFactory } = require('./src/logger');
const get = require('lodash').get;
const AOP = require('./src/AOP');

const main = async (event, context) => {
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
    AOP.inject(service, serviceLoggerAspect, 'around', 'methods');

    await service.service(event, context);
    
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };;
};

exports.handler = async (event, context) => await main(event, context);
