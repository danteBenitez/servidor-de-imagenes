const { sequelize, DataTypes } = require('../db.js');

// Modelo para un proveedor de imágenes
// El proveedor de ID 1 está reservado para el servidor propio
const Provider = sequelize.define('provider', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true
});

module.exports = Provider;