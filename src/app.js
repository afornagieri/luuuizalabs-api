const express = require('express');
const errorHandlerMiddleware = require('./middlewares/errorHandlerMiddleware.js');
const authenticationMiddleware = require('./middlewares/authenticationMiddleware.js');
const customerRoutes = require('./routes/customerRoutes.js');
const authenticationRoutes = require('./routes/authenticationRoutes.js');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const basicAuth = require('express-basic-auth');

require('dotenv').config();

const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const app = express();
app.use(express.json());


app.use('/api/auth', authenticationRoutes);
app.use('/api/customers', authenticationMiddleware, customerRoutes);

app.use(errorHandlerMiddleware);

app.use(  '/docs',
    basicAuth({
      users: { 
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS 
      },
      challenge: true,
      realm: 'Swagger UI'
    }),
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument));

module.exports = app;
