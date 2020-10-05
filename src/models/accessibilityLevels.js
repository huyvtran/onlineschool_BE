const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('accessibilitylevels', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ACCESSLEVELID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    ACCESSLEVEL: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    DESCRIPTION: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    GROUPID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;