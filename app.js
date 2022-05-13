const process = require('process');
const express = require('express');

const app = express();

const { PORT = 3000 } = process.env;
app.use(express.json());

const { NOT_FOUND, mongoose } = require('./utils/constants');
const { login, createUser } = require('./controllers/users');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.post('/signin', login);
app.post('/signup', createUser);

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(userRouter);
app.use(cardRouter);

app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неорректный путь запроса' });
});

// app.use((err, req, res, next) => {
//   if (err) {
//     res
//       .status(DEFAULT_ERROR)
//       .send({ message: `Ошибка: ${err}` });
//   } else {
//     next();
//   }
// });

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
