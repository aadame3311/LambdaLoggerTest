const { getLogger } = require('./logger');

const service = async (event, context) => {
    const {
        body
    } = event;
    
    const jsonBody = JSON.parse(body);
    const logger = getLogger('service').child({ 
        method: 'service', 
        body: jsonBody 
    });
    
    logger.info('Start');
    logger.info('End');
}

module.exports = service;
