const { getCustomers } = require('../src/controllers/customerController.js');
const customerService = require('../src/services/customerService.js');

jest.mock('../src/services/customerService.js', () => ({
  getCustomersAsync: jest.fn()
}));

describe('customerController.getCustomers', () => {
    let req, res, next;

    beforeEach(() => {
        req = {};
        res = { json: jest.fn() };
        next = jest.fn();
    });
    
    it('Should call customerService and return a JSON', async () => {
        const fake = [{ id: 1, name: 'Artur' }];
        
        customerService.getCustomersAsync.mockResolvedValue(fake);
    
        await getCustomers(req, res);
    
        expect(customerService.getCustomersAsync).toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(fake);
        expect(next).not.toHaveBeenCalled();
    });
});