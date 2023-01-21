import jwt from 'jsonwebtoken';

import Unauthorized from '../errors/unauthorized';

// eslint-disable-next-line consistent-return
const auth = async (req, res, next) => {
  const { authorization } = await req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new Unauthorized('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'JWT_SECRET');
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

export default auth;
