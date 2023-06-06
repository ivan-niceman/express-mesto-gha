const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Пользователь не авторизован'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new Unauthorized('Пользователь не авторизован'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
