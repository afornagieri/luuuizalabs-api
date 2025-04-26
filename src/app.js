const express = require('express');
const customerRoutes = require('./routes/customerRoutes.js');

require('dotenv').config();

const app = express();
app.use(express.json());

app.use('/api/customers', customerRoutes);

module.exports = app;
