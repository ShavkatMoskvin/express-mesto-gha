const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  console.log(req.body);

  bcrypt.hash(password, 10)
    .then((hash) => {
      userModel
        .create({
          name, about, avatar, email, password: hash,
        })
        .then((user) => res.send(user))
        .catch(next);
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

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        // eslint-disable-next-line no-undef
        NODE_ENV === 'production' ? JWT_SECRET : 'secret',
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          httpOnly: true,
          maxAge: 3600000 * 24 * 7,
        })
        .send({ message: 'Успешный вход' });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
};
