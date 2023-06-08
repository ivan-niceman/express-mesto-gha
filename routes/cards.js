const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { validateCardBody, validationCardId } = require('../middlewares/validate');

router.get('/', cardsController.getCards);

router.post('/', validateCardBody, cardsController.createCard);

router.delete('/:cardId', validationCardId, cardsController.deleteCardById);

router.put('/:cardId/likes', validationCardId, cardsController.likeCard);

router.delete('/:cardId/likes', validationCardId, cardsController.dislikeCard);

module.exports = router;
