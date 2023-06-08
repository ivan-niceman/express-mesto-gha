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
  cardModel
    .create({ owner: req.user._id, ...req.body })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки'));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  cardModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Такой карточки не существует');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить данную карточку');
      }
      cardModel
        .findByIdAndRemove(req.params.cardId)
        .then(() => {
          res.send({ message: 'Карточка удалена' });
        })
        .catch(next);
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
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
};
