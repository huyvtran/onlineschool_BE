const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    GROUPID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    GROUPNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    },STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;