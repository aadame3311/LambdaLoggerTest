const AOP = require('./src/AOP');
const logger = require('./src/logger');
const get = require('lodash').get;

const main = async (event, context) => {
    /*required*/ logger.addLoggers(['default', 'service', 'helper'], {
        namespace: 'lambda::logger::test',
        environment: process.env.NODE_ENV,
        aws_request_id: get(context, 'awsRequestId'),
        labels: {
            body: JSON.parse(get(event, 'body'))
        }
    });

    const service = require('./src/service');
    /*required*/ AOP.inject(service, logger.loggerAspectFactory('service', 'info'), 'around', 'methods');

    return await service.service(event, context);
};

main({ body: "{ \"foo\": 1 }"}, { awsRequestId: 123});

exports.handler = async (event, context) => await main(event, context);
