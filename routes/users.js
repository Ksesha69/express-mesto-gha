const routerUser = require('express').Router();
const {
  getUsers, getUsersId, changeUser, changeAvatar, getUserInfo,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUsersId);
routerUser.patch('/me', changeUser);
routerUser.patch('/me/avatar', changeAvatar);
routerUser.get('/me', getUserInfo)

module.exports = routerUser;
