const express = require('express');
const sequelize = require('./config/database');

const app = express();
app.use(express.json());

const router = require('./routes/router')
app.use(router);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
});