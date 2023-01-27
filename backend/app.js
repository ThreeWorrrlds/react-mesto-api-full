require('dotenv').config();
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
const { requestLogger, errorLogger } = require('./middlewares/logger');
const NotFound = require('./middlewares/validatons');

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
app.use(requestLogger);
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.post('/signup', validateUserData, createUser);
app.post('/signin', validateUserData, login);

app.use(auth);
app.use(usersRoutes);
app.use(cardsRoutes);

app.use('*', (req, res, next) => {
  next(new NotFound('Не верен путь этот...'));
});

app.use(errorLogger);

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
