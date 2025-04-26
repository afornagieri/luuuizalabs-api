import express, { json } from 'express';
import { configDotenv } from 'dotenv';
import customerRoutes from './routes/customerRoutes.js'

const app = express();
app.use(json());

configDotenv();

app.use('/api/customers', customerRoutes);

export default app;
