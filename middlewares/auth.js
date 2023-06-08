const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/unauthorized');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new Unauthorized('Пользователь не авторизован'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.checkToken(token);
  } catch (err) {
    return next(new Unauthorized('Пользователь не авторизован'));
  }

  req.user = payload;
  return next();
};
