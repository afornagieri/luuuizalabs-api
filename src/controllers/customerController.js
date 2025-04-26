const customerService = require('../services/index.js');

async function getCustomers(_, res) {
    try {
        const result = await customerService.getCustomersAsync();
        res.json(result);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    getCustomers
}