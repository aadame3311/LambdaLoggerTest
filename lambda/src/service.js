const { getLogger } = require('./logger');

async function logService(event, context) {
    const logger = getLogger('service').child({ 
        method: 'service', 
        body: JSON.parse(event?.body) 
    });
    
    logger.info('Service log');
}

module.exports = {
    logService
}
