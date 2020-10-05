const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('activitymaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ACTIVITYID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    ACTIVITYNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
});
module.exports = messages;