/* eslint-disable consistent-return */
const cardModel = require('../models/card');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');

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
    .catch(next);
};

const deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  cardModel
    .findByIdAndDelete(cardId)
    .orFail(() => {
      next(new NotFound('Карточка с указанным _id не найдена'));
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (owner !== req.user._id) {
        return next(new Forbidden('Невозможно удалить данную карточку'));
      }
      res.send({ message: 'Карточка удалена' });
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
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка с указанным _id не найдена'));
      }
      res.send(card);
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
    .then((card) => {
      if (!card) {
        return next(new NotFound('Карточка с указанным _id не найдена'));
      }
      res.send(card);
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
