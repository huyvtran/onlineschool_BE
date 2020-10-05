const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('institutecurriculum', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID: {
        type: Sequelize.STRING(5),
        allowNull: false,
    },
    CURRID: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    }
    ,
    INSTCURID: {
        type: Sequelize.STRING(6),
        allowNull: true
    }
});
module.exports = messages;