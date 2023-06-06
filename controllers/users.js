/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');

const getUser = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;
  userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => userModel.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 11000) {
        return next(new BadRequest('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      res.status(200).send(user);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  userModel
    .findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return next(new Unauthorized('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized('Неправильная почта или пароль'));
          }
          return user;
        });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  userModel
    .findById(_id)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      res.send(user);
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserInfo,
};
