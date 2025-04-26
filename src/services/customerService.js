const customerRepository =  require('../repositories/index.js');

function getCustomersAsync() { 
    return customerRepository.getAll();
}

module.exports = {
    getCustomersAsync
}