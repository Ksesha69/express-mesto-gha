const routerUser = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, getUserInfo, getUsersId, changeUser, changeAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/me', getUserInfo);
routerUser.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().required().length(24),
  }),
}), getUsersId);

routerUser.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), changeUser);

routerUser.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(),
  }),
}), changeAvatar);

module.exports = routerUser;
