const service = require('./src/service');
const { addLoggers, getLogger } = require('./src/logger');
const get = require('lodash').get;

exports.handler = async (event, context) => {
    addLoggers(['default', 'service'], {
        namespace: 'lambda::logger::test',
        environment: process.env.NODE_ENV,
        aws_request_id: get(context, 'awsRequestId'),
        labels: {
            body: JSON.parse(get(event, 'body'))
        }
    });

    const logger = getLogger('default');
    logger.info('Start');

    // main logic
    await service(event, context);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };

    logger.info('End');
    return response;
};
