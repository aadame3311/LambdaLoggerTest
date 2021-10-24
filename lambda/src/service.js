const AOP = require('./AOP');
const { getLogger, loggerAspectFactory } = require('./logger');

const helpers = require('./helper');
AOP.inject(helpers, loggerAspectFactory('helper', 'info'), 'around', 'methods');

const service = async (event, context) => {
    AOP.inject(require('./helper'), loggerAspectFactory('helper', 'info'), 'around', 'methods');
    
    const logger = getLogger('service').child({ 
        method: 'service', 
        body: JSON.parse(event?.body) 
    });

    logger.info('Service log');

    helpers.helper1();
    helpers.helper2();
}

module.exports = {
    service
}