const AOP = require('./src/common_packages/AOP');
const logger = require('./src/common_packages/logger');
const get = require('lodash').get;

const service = require('./src/service');
const helpers = require('./src/helper');

const main = async (event, context) => {
    
    logger.addLoggers(['default', 'service', 'helper'], {
        namespace: 'lambda::logger::test',
        environment: 'dev',//process.env.NODE_ENV,
        aws_request_id: get(context, 'awsRequestId'),
        labels: {
            body: JSON.parse(get(event, 'body'))
        }
    });

    // create all aspects for every module
    const serviceLoggerAspect = logger.loggerAspectFactory({
        loggerName: 'service',
        logLevel: 'info'
    });
    const helperLoggerAspect = logger.loggerAspectFactory({
        loggerName: 'helper',
        logLevel: 'info'
    });

    // inject aspects into all modules
    AOP.inject(service, serviceLoggerAspect, 'around', 'methods'); // will log Start & End
    AOP.inject(helpers, helperLoggerAspect, 'before', 'method', 'helper1'); // will only log Start
    AOP.inject(helpers, helperLoggerAspect, 'after', 'method', 'helper2'); // will only log End
    
    let result;
    try {
        result = await service.service(event, context);
    } finally {
        AOP.flushAll();

        return result;
    }
};

// (async() => {
//     await main({ body: "\"\{ test: 1\}\"", headers: {}}, { awsRequestId: "123" })

// })();

// need exports.handler for lambda function.
exports.handler = async (event, context) => await main(event, context);
