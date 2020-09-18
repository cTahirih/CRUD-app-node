require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/user'));

mongoose.connect(
  'mongodb://localhost:27017/shoesStore',
  {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
  (error, resp) => {
  if(error) throw error;

  console.log('Base de datos ONLINE');
});

app.listen(process.env.PORT, () => {
  console.log('Escuchando puerto', process.env.PORT);
})