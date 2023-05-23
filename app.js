const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

const NOT_FOUND = 404;

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '646b00eca8ce73de1cb95a3b',
  };

  next();
});

app.use(router);
app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: 'Не правильный адрес!' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', { useNewUrlParser: true, useUnifiedTopology: true, family: 4 });

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
