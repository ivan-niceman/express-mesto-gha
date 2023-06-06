/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const Conflict = require('../errors/conflict');
const NotFound = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');

const getUser = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      if (!users) {
        return next(new NotFound('Список пользователей не найден'));
      }
      res.status(200).json(users);
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const userId = req.params._id;
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
      res.status(201).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new Conflict('Пользователь с такой почтой уже существует'));
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
    .findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new Unauthorized('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new Unauthorized('Неправильная почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
          res.status(200).json({ token });
        });
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  const userId = req.user._id;

  userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound('Пользователь с указанным _id не найден'));
      }
      const { password, ...userData } = user.toObject();

      res.status(200).json(userData);
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
