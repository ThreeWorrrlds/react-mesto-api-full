import express from 'express';

import {
  getCards, createCard, deleteCardById, setLikeByCardId, unsetLikeByCardId,
} from '../controllers/cards';

import { validateCardData, validateCardId } from '../middlewares/validatons';

const cardsRoutes = express.Router();

cardsRoutes.get('/cards', getCards);

cardsRoutes.post('/cards', validateCardData, createCard);

cardsRoutes.delete('/cards/:cardId', validateCardId, deleteCardById);

cardsRoutes.put('/cards/:cardId/likes', validateCardId, setLikeByCardId);

cardsRoutes.delete('/cards/:cardId/likes', validateCardId, unsetLikeByCardId);

export default cardsRoutes;
