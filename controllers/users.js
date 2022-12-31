const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
  OK_200,
  ERROR_500,
  ERROR_404,
  ERROR_401,
  ERROR_400,
  MESSAGE_500,
  MESSAGE_404,
  MESSAGE_400,
} = require('../errors/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      console.log(e);
      return res.status(ERROR_500).json({ message: MESSAGE_500 });
    });
};

module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(ERROR_404).send({ message: MESSAGE_404 });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email
  } = req.body;
  bcrypt.hash(req.body.password, 10)
  .then((hash) => User.create({
    name,
    about,
    avatar,
    email,
    password: hash,
  }))
    .then((user) => res.status(OK_200).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } if (err.code === 11000) {
        return next(new ConflictError(`Данный ${email} уже существует`));
      }
    });
};

module.exports.changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (user) res.send({ name, about });
      else {
        res.status(MESSAGE_404).send({ message: MESSAGE_404 });
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.changeAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
  )
    .then((user) => {
      if (user) res.send({ avatar });
      else {
        res.status(ERROR_404).send({ message: MESSAGE_404 });
      }
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
  token: jwt.sign({ _id: user._id }, 'super-strong-secret', { expiresIn: '7d'})
});
    })
    .catch((err) => {
      console.log(err);
      res.status(ERROR_400).send({ message: 'Неправильная почта или пароль' });
    });
};

module.exports.getUserInfo = (req, res) => {
  User.findById(req.user)
    .then((user) => {
    if (user) res.send({ user });
    else res.status(ERROR_404).send({ message: 'Пользователь с данным ID не найден' });;
  })
    .catch((err) => {
      res.status(401).send({ message: '' });
    });
};