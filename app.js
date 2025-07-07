const express = require("express");
const path = require("path");
const sequelize = require("./config/database");
const cookieParser = require('cookie-parser');
const router = require("./routes/router");
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/docs');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res, next) => {res.locals.currentUrl = req.originalUrl; next();});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(router);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
});