const { getLogger } = require("./common_packages/logger")


const helper1 = async () => {
    await new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
}

const helper2 = (param) => {
    const logger = getLogger('helper');
    logger.info('in helper 2');
}

module.exports = {
    helper1,
    helper2
}