const service = require('./src/service');

exports.handler = async (event, context) => {
    console.log('Start', JSON.stringify(event, context));
    
    
    console.log('End', JSON.stringify({ event, context }));
    
    await service(event, context);

    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
