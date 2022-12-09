const User = require('../models/user');

const {
  OK_200,
  ERROR_500,
  ERROR_404,
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
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.status(OK_200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_400).send({ message: MESSAGE_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
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
