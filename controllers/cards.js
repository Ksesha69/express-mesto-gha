const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((e) => {
      console.log(e);
      return res.status(500).json({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name !== 'SomeErrorName') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete({ _id: req.params.cardId })
    .then(() => {
      res.send({ message: 'Карточка удалена' });
    })
    .catch((e) => {
      console.log(e);
      return res.status(404).json({ message: 'Карточка с указанным _id не найдена.' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) res.send(card);
      else res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
    })
    .catch((err) => {
      if (err.name !== 'SomeErrorName') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card) res.send(card);
      else res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятия лайка' });
    })
    .catch((err) => {
      if (err.name !== 'SomeErrorName') {
        res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию' });
      }
    });
};
