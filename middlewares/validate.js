const { celebrate, Joi } = require('celebrate');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/^https*:\/\/[A-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
});

const validateEditUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateEditUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https*:\/\/[A-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
});

const validateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(/^https*:\/\/[A-Z0-9-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().hex().length(24),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().alphanum().hex().length(24),
  }),
});

module.exports = {
  validateUserBody,
  validateCardBody,
  validateEditUserInfo,
  validateEditUserAvatar,
  validationUserId,
  validationCardId,
};
