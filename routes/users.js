const routerUser = require('express').Router();
const {
  getUsers, createUser, getUsersId, changeUser, changeAvatar,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUsersId);
routerUser.post('/', createUser);
routerUser.patch('/me', changeUser);
routerUser.patch('/me/avatar', changeAvatar);

module.exports = routerUser;
