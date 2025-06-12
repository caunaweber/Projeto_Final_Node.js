const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('node_final', 'root', 'root', {
    host: 'localhost',
    port: 3307,
    dialect: 'mysql',
    logging: false
})

module.exports = sequelize;
