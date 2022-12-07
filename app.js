const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routerUser = require('./routes/users');
const routerCards = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '638f90ff077ccea9cbef4d95',
  };
  next();
});

app.use('/users', routerUser);
app.use('/cards', routerCards);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
