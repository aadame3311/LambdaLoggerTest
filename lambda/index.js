const AOP = require('./src/AOP');
const { addLoggers, loggerAspectFactory } = require('./src/logger');
const get = require('lodash').get;

let context = {};
let event = { body: "{}" }
addLoggers(['default', 'service', 'helper'], {
    namespace: 'lambda::logger::test',
    environment: process.env.NODE_ENV,
    aws_request_id: get(context, 'awsRequestId'),
    labels: {
        body: JSON.parse(get(event, 'body'))
    }
});

const service = require('./src/service');
AOP.inject(service, loggerAspectFactory('service', 'info'), 'around', 'methods');

const main = async (event, context) => {
    event = event;
    context = context;

    await service.service(event, context);
    
    return {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };;
};

//main({ body: "{ \"foo\": 1 }"}, {});

exports.handler = async (event, context) => await main(event, context);
