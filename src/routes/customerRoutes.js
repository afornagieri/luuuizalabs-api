const express = require('express');
const { customerController } = require('../controllers/index.js');

const router = express.Router();

router.get('/', customerController.getCustomers);
router.post('/', customerController.createCustomer);
router.put('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;
