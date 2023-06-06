/* eslint-disable consistent-return */
const cardModel = require('../models/card');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');
const BadRequest = require('../errors/badrequest');

const getCards = (req, res, next) => {
  cardModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  cardModel
    .create({ name, link, owner })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные'));
      }
    });
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndDelete(cardId)
    .orFail()
    .then((card) => {
      cardModel
        .deleteOne({ _id: card._id, owner: req.user._id })
        .then((result) => {
          if (result.deletedCount === 0) {
            next(new Forbidden('Невозможно удалить данную карточку'));
          }
        });
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка с указанным _id не найдена'));
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        next(new NotFound('Карточка с указанным _id не найдена'));
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
