const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('subjectmaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    SUBJECTID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    SUBJECTNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    CSSCLASS: {
        type: Sequelize.STRING(45),
        allowNull: true   
    },
    CSSIMAGE: {
        type: Sequelize.STRING(45),
        allowNull: true
    }
});
module.exports = messages;