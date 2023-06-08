const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super-strong-secret';
const signToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
const checkToken = (token) => jwt.verify(token, 'super-strong-secret');
module.exports = {
  signToken, checkToken,
};
