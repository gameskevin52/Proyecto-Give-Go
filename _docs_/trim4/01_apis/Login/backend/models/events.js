const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Event = sequelize.define('Event', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },

    fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },

    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

module.exports = Event;