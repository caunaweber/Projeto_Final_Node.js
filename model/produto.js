const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Produto = sequelize.define('Produto', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'produtos',
});

module.exports = Produto;