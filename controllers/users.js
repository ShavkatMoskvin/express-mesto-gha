const userModel = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require('../utils/constants');

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Некорректный ID пользователя' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel
    .create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные или неполные данные' });
      } else {
        res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные или неполные данные',
          });
          break;
        case 'CastError':
          res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
          break;
        default:
          res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const userId = req.user._id;
  userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => res.send(user))
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные или неполные данные',
          });
          break;
        case 'CastError':
          res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
          break;
        default:
          res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};
