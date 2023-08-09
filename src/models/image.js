const Provider = require('./provider');
const { sequelize, DataTypes } = require('../db');

const Image = sequelize.define('image', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        references: {
            model: 'providers',
            key: 'id'
        }
    },
    isLocalFile: {
        // Campo calculado que permite decidir si una determinada imagen está almacenada de modo local
        // o no
        type: DataTypes.VIRTUAL,
        get: () => {
            return this.provider_id === 1;
        }
    }
}, {
    paranoid: true,
    timestamps: true,
});

// Relacionar imagen con proveedores
Provider.hasMany(Image, { key: 'provider_id' });
Image.belongsTo(Provider, { key: 'provider_id' });

module.exports = Image;