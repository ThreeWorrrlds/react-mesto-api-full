const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const usersRoutes = require('./routes/users');
const cardsRoutes = require('./routes/cards');
const {
  login, createUser,
} = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { errorHandler } = require('./middlewares/error-handler');
const { validateUserData } = require('./middlewares/validatons');
const NotFound = require('./middlewares/validatons');

/* import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import cors from 'cors';
import usersRoutes from './routes/users.js';
import cardsRoutes from './routes/cards.js';
import {
  login, createUser,
} from './controllers/users.js';
import auth from './middlewares/auth.js';
import errorHandler from './middlewares/error-handler.js';
import { validateUserData } from './middlewares/validatons.js';
import NotFound from './errors/not-found.js'; */

const app = express();
app.use(cors());
mongoose.set('strictQuery', false);
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 1000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.use(helmet());
app.disable('x-powered-by');

app.use(express.json());
app.post('/signup', validateUserData, createUser);
app.post('/signin', validateUserData, login);

app.use(auth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use('*', (req, res, next) => {
  next(new NotFound('Не верен путь этот...'));
});

app.use(errors());

app.use(errorHandler);

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('OK');
  await app.listen(PORT);
}
main();
