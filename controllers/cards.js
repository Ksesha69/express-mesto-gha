const Card = require('../models/card');

const {
  ERROR_500,
  ERROR_404,
  ERROR_400,
  MESSAGE_500,
  MESSAGE_404,
  MESSAGE_400,
} = require('../errors/errors');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => {
      res.send(cards);
    })
    .catch((e) => {
      console.log(e);
      return res.status(ERROR_500).json({ message: MESSAGE_500 });
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
      if (err.name !== 'CastError') {
        res.status(ERROR_400).send({ message: ERROR_400 });
      } else {
        res.status(ERROR_500).send({ message: MESSAGE_500 });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete({ _id: req.params.cardId })
    .then((card) => {
      if (card) res.send({ message: 'Карточка удалена' });
      else res.status(ERROR_404).send({ message: MESSAGE_404 });
    })
    .catch((e) => {
      console.log(e);
      return res.status(ERROR_400).json({ message: MESSAGE_400 });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) res.send(card);
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

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (card) res.send(card);
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
