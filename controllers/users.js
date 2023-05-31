/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user');

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

const { CastError, ValidationError } = mongoose.Error;

const getUser = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const getUserById = (req, res) => {
  userModel
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найдена.',
        });
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) => userModel.create({
      name, about, avatar, email, password: hashedPassword,
    }))
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  userModel
    .findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найдена',
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userModel
    .findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        res.status(NOT_FOUND).send({
          message: 'Пользователь с указанным _id не найдена',
        });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        return res.status(BAD_REQUEST).send({
          message: 'Переданы некорректные данные',
          err: err.message,
          stack: err.stack,
        });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({
        message: 'На сервере произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  // const { owner } = req.user;

  userModel
    .findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
          res.cookie('jwt', token, {
            httpOnly: true,
          });
          res.send({ message: 'Всё верно!' });
        });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const getUserInfo = (req, res) => {
  const { _id } = req.user;

  userModel
    .findById(_id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({
          message: 'Пользователь не найден',
        });
      }
      res.send(user);
    })
    .catch((err) => {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
    });
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
