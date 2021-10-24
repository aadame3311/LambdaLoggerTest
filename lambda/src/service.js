const AOP = require('./AOP');
const { getLogger, loggerAspectFactory } = require('./logger');

const helpers = require('./helper');
/*required*/ AOP.inject(helpers, loggerAspectFactory('helper', 'info'), 'around', 'methods');

const service = async (event, context) => {    
    helpers.helper1();
    helpers.helper2("test");

    return {
        statusCode: 200
    }
}

module.exports = {
    service
}