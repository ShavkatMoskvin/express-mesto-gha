const process = require('process');
const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { validateUrl } = require('./utils/utils');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

const NotFoundError = require('./errors/NotFoundError');
const { mongoose } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const errorHandler = require('./middlewares/errorHandler');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl, 'custom validation'),
  }),
}), createUser);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(userRouter);
app.use(cardRouter);
app.use(errorHandler); // Централизованный обработчик ошибок

app.use('/', (req, res, next) => {
  try {
    throw new NotFoundError('Неорректный путь запроса');
  } catch (err) {
    next(err);
  }
});

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
