const { getLogger } = require("./logger")


const helper1 = () => {
    const logger = getLogger('helper');

    logger.info('in helper1');
}

const helper2 = () => {
    const logger = getLogger('helper');

    logger.info('in helper2');
}

module.exports = {
    helper1,
    helper2
}