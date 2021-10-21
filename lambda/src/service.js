const service = async (event, context) => {
    const {
        body
    } = event;

    const jsonBody = JSON.parse(body);

    console.log('Service', JSON.stringify({ jsonBody }));
}

module.exports = service;
