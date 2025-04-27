const express = require('express');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware.js');
const authenticationMiddleware = require('./middlewares/authenticationMiddleware.js');
const customerRoutes = require('./routes/customerRoutes.js');
const authenticationRoutes = require('./routes/authenticationRoutes.js');

require('dotenv').config();

const app = express();
app.use(express.json());


app.use('/api/auth', authenticationRoutes);
app.use('/api/customers', authenticationMiddleware, customerRoutes);

app.use(errorHandlerMiddleware);

module.exports = app;
