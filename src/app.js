import express, { json } from 'express';
require('dotenv').config();

const app = express();
app.use(json());

export default app;
