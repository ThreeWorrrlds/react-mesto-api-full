const express = require('express');

const {
  getCards, createCard, deleteCardById, setLikeByCardId, unsetLikeByCardId,
} = require('../controllers/cards');

const { validateCardData, validateCardId } = require('../middlewares/validatons');

const cardsRoutes = express.Router();

cardsRoutes.get('/cards', getCards);

cardsRoutes.post('/cards', validateCardData, createCard);

cardsRoutes.delete('/cards/:cardId', validateCardId, deleteCardById);

cardsRoutes.put('/cards/:cardId/likes', validateCardId, setLikeByCardId);

cardsRoutes.delete('/cards/:cardId/likes', validateCardId, unsetLikeByCardId);

module.exports = cardsRoutes;
