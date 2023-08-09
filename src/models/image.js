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
            model: 'provider',
            key: 'id'
        }
    },
    is_file: {
        // Campo calculado que permite decidir si una determinada imagen está almacenada de modo local
        // o no
        type: DataTypes.VIRTUAL,
        get: (model) => {
            return model.provider_id === 1;
        }
    }
}, {
    paranoid: true,
    timestamps: true,
});

module.exports = Image;