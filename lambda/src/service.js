const { getLogger } = require('./logger');

const logService = async (event, context) => {
    const logger = getLogger('service').child({ 
        method: 'service', 
        body: JSON.parse(event?.body) 
    });
    
    logger.info('Service log');
}

module.exports = {
    logService
}
