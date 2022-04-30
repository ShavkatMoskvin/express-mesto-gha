const card = require('../models/card');
const { BAD_REQUEST, NOT_FOUND, DEFAULT_ERROR } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  card
    .find({})
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(DEFAULT_ERROR).send({ message: `Ошибка: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  
  console.log(req.body)

  card
    .create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(BAD_REQUEST)
          .send({ message: `Переданы некорректные или что то пошло не так: ${err}` });
      } else {
        res.status(DEFAULT_ERROR).send({ message: `Что-то пошло не так: ${err}` });
      }
    });
};

module.exports.removeCard = (req, res) => {
  const { cardId } = req.params;
  card
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Передан некорректный ID карточки' });
      }
    });
};

module.exports.setLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  card
    .findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(BAD_REQUEST).send({
            message: `Переданы некорректные или неполные данные, ошибка${err}`,
          });
          break;
        case 'CastError':
          res
            .status(BAD_REQUEST)
            .send({ message: `Передан некорректный ID карточки, ошибка${err}` });
          break;
        default:
          res.status(DEFAULT_ERROR).send({ message: `Что-то пошло не так, ошибка${err}` });
      }
    });
};

module.exports.removeLike = (req, res) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  card
    .findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true })
    .then((card) => {
      if (card) {
        res.send(card);
      } else {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => {
      switch (err.name) {
        case 'ValidationError':
          res.status(BAD_REQUEST).send({
            message: 'Переданы некорректные или неполные данные',
          });
          break;
        case 'CastError':
          res
            .status(BAD_REQUEST)
            .send({ message: 'Передан некорректный ID карточки' });
          break;
        default:
          res.status(DEFAULT_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};
