const express = require('express');
const { customerController } = require('../controllers/index.js');

const router = express.Router();

router.get('/', customerController.getCustomers);

module.exports = router;
