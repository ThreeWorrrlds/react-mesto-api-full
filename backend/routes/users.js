const express = require('express');

const { validateUserId, validateUserUpdateInfo, validateUserUpdateAvatar } = require('../middlewares/validatons');

const {
  getUsers, getUserById, updateUserInfo, updateUserAvatar, getCurrentUser,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/users/me', getCurrentUser);

usersRoutes.get('/users', getUsers);

usersRoutes.get('/users/:id', validateUserId, getUserById);

usersRoutes.patch('/users/me', validateUserUpdateInfo, updateUserInfo);

usersRoutes.patch('/users/me/avatar', validateUserUpdateAvatar, updateUserAvatar);

module.exports = usersRoutes;
