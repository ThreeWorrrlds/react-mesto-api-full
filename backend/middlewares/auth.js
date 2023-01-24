const jwt = require('jsonwebtoken');

const Unauthorized = require('../errors/unauthorized');

/* import jwt from 'jsonwebtoken';

import Unauthorized from '../errors/unauthorized'; */

// eslint-disable-next-line consistent-return
module.exports.auth = async (req, res, next) => {
  const { authorization } = await req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'JWT_SECRET');
    } catch (err) {
      next(new Unauthorized('Необходима авторизация'));
    }
    req.user = payload;
  }
  next();
};

/* export default auth; */
