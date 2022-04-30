const process = require('process');
const express = require('express');
const app = express();
const { PORT = 3000 } = process.env;
app.use(express.json());
app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
}) 

const { NOT_FOUND, DEFAULT_ERROR } = require('./utils/constants');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

app.use(userRouter);
app.use(cardRouter);


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Неорректный путь запроса' });
});

app.use((err, req, res, next) => {
  if (err) {
    res
      .status(DEFAULT_ERROR)
      .send({ message: `Ошибка: ${err}` });
  } else {
    next();
  }
});

app.use((req, res, next) => {
  req.user = {
    _id: '626c2a9150153667d839b9e6',
  };

  next();
});



