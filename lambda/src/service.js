const helpers = require('./helper');

const service = async (event, context) => {    
    // call helper methods
    helpers.helper1();
    helpers.helper2("test");

    return {
        statusCode: 200
    }
}

module.exports = {
    service
}