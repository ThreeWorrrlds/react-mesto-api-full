import CardModel from '../models/Card';

import BadRequestError from '../errors/bad-request-error';

import Forbidden from '../errors/forbidden';

import NotFound from '../errors/not-found';

export const getCards = async (req, res, next) => {
  try {
    const cards = await CardModel.find({});
    if (cards) {
      res.status(200).send(cards);
    } else {
      next(new NotFound('Карточки не найдены'));
    }
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const id = req.user._id;
    const newCard = await CardModel.create({ name, link, owner: id });
    res.status(201).send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные для создания карточки'));
    } else {
      next(err);
    }
  }
};

export const deleteCardById = async (req, res, next) => {
  await CardModel.findById(req.params.cardId)
    .orFail(new Error('NotFound'))
    .then((card) => {
      if (req.user._id === card.owner.toString()) {
        CardModel.findByIdAndRemove(req.params.cardId)
          .then((item) => {
            res.status(200).send({ message: `Карточка ${req.params.cardId} удалена ${item}` });
          })
          .catch((err) => next(err));
      } else {
        next(new Forbidden('Нельзя удалять чужую карточку'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    });
};

export const setLikeByCardId = async (req, res, next) => {
  await CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  ).populate('likes')
    .orFail(new Error('NotFound'))
    .then((responce) => res.send({ data: responce }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    });
};

export const unsetLikeByCardId = async (req, res, next) => {
  await CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate('likes')
    .orFail(new Error('NotFound'))
    .then((responce) => res.send({ data: responce }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка'));
      } else if (err.message === 'NotFound') {
        next(new NotFound('Карточка с указанным id не найдена'));
      } else {
        next(err);
      }
    });
};
