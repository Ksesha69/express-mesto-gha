const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');
const {
  ERROR_404,
  MESSAGE_404,
} = require('./errors/errors');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/users', auth, routerUser);
app.use('/cards', auth, routerCards);

app.use('*', (req, res, next) => {
  res.status(ERROR_404).send({ message: MESSAGE_404 });
  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
