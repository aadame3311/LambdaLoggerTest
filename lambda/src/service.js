const { getLogger } = require('./logger');

const service = async (event, context) => {
    const logger = getLogger('service').child({ 
        method: 'service', 
        body: jsonBody 
    });
    
    logger.info('Service log');
}

module.exports = service;
