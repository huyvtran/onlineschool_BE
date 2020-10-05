const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('alactivities', {
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
    ACCESSLEVELID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    ACTIVITYID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    ACTIVITYNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    ALACTIVITYID: {
        type: Sequelize.STRING(6),
        allowNull: true
    },
    CSSCLASS: {
        type: Sequelize.STRING(45),
        allowNull: true
    }
});
module.exports = messages;