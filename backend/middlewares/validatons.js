import { celebrate, Joi } from 'celebrate';
import { isValidObjectId } from 'mongoose';
import validator from 'validator';

// eslint-disable-next-line import/prefer-default-export
export const validateUserData = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Некорректный URL');
    }),
  }).unknown(),
});

export const validateUserId = celebrate({
  params: Joi.object()
    .keys({
      id: Joi.string().required().custom((value, helpers) => {
        if (isValidObjectId(value)) {
          return value;
        }
        return helpers.message('Некорректный id пользователя');
      }),
    }).unknown(),
});

export const validateUserUpdateInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(),
});

export const validateUserUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Некорректный URL');
    }),
  }).unknown(),
});

export const validateCardData = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().custom((value, helpers) => {
        if (validator.isURL(value)) {
          return value;
        }
        return helpers.message('Некорректный URL картинки');
      }),
    }).unknown(),
});

export const validateCardId = celebrate({
  params: Joi.object()
    .keys({
      cardId: Joi.string().required().custom((value, helpers) => {
        if (isValidObjectId(value)) {
          return value;
        }
        return helpers.message('Некорректный id карточки');
      }),
    }).unknown(),
});
