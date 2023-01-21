import bcrypt from 'bcryptjs';

import jwt from 'jsonwebtoken';

import UserModel from '../models/User';

import BadRequestError from '../errors/bad-request-error';

import Conflict from '../errors/conflict';

import NotFound from '../errors/not-found';

import Unauthorized from '../errors/unauthorized';

export const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => UserModel.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => {
      res.status(201)
        .send({
          email: user.email,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
        });
      next();
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        next(new Conflict('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'JWT_SECRET', { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(() => {
      next(new Unauthorized('Неправильный логин или пароль'));
    });
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = await UserModel.findById(req.user._id);
    if (currentUser) {
      res.status(200).send(currentUser);
    } else {
      next(new NotFound('Пользователь не найден'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(err);
    }
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find({});
    if (users) {
      res.status(200).send(users);
    } else {
      next(new NotFound('Пользователи не найдены'));
    }
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.status(200).send(user);
    } else {
      next(new NotFound('Пользователь не найден'));
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Невалидный id'));
    } else {
      next(err);
    }
  }
};

export const updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const newInfo = await UserModel.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true, upsert: false },
    );
    res.status(200).send(newInfo);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const newAvatar = await UserModel.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true, upsert: false },
    );
    res.status(200).send(newAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Некорректные данные при обновлении аватара'));
    } else {
      next(err);
    }
  }
};
