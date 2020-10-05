const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const studentsubjects = sequelize.define('studentsubjects', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    STUDENTID: {
        type: Sequelize.STRING(11),
        allowNull: false,
    },
    INSTCURID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: true
    },
});
module.exports = studentsubjects;