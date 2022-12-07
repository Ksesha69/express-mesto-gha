const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ message: 'Произошла ошибка' });
    });
};

module.exports.getUsersId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(404).send({ message: 'Пользователь не найден' });
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ message: 'Ошибка по умолчанию' });
    });
};

module.exports.createUser = (req, res) => {
  User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
  })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.changeUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
  )
    .then((user) => {
      if (user) res.send({ name, about });
      else {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
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
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара' });
      }
    })
    .catch((err) => {
      if (err.name === 'SomeErrorName') {
        res.status(404).send({ message: 'Пользователь не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
