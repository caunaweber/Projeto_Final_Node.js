require('dotenv').config(); // <- Carrega variáveis do .env

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,       
    process.env.DB_USER,       
    process.env.DB_PASSWORD,   
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_DIALECT,
        logging: false
    }
);

/*
casa:
const sequelize = new Sequelize('node_final', 'root', 'mysql123', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    logging: false
})

facul:
const sequelize = new Sequelize('node_final', 'root', 'root', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false
})
*/

module.exports = sequelize;
