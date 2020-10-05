const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('countrymaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    NAME: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;