const routerUser = require('express').Router();
const {
  getUsers, createUser, getUsersId, changeUser, changeAvatar, notFound,
} = require('../controllers/users');

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUsersId);
routerUser.post('/', createUser);
routerUser.patch('/me', changeUser);
routerUser.patch('/me/avatar', changeAvatar);
routerUser.patch('/404', notFound);

module.exports = routerUser;
