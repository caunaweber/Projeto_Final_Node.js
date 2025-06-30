const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const Avaliacao = sequelize.define('Avaliacao', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    comentario: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    avaliacao: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'avaliacoes',
    timestamps: true,
    createdAt: 'data_criacao',
    updatedAt: false
});

Avaliacao.associate = (models) => {
    Avaliacao.belongsTo(models.Produto, {
        foreignKey: 'produtoId',
        as: 'produto'
    });

    Avaliacao.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'usuario'
    });
}

module.exports = Avaliacao;