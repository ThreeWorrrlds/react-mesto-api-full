import { rateLimit } from 'express-rate-limit';

import helmet from 'helmet';

import express from 'express';

import mongoose from 'mongoose';

import { errors } from 'celebrate';

import usersRoutes from './routes/users';

import cardsRoutes from './routes/cards';

import {
  login, createUser,
} from './controllers/users';

import auth from './middlewares/auth';

import errorHandler from './middlewares/error-handler';

import { validateUserData } from './middlewares/validatons';

import NotFound from './errors/not-found';

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
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
  await app.listen(PORT);
}
main();
