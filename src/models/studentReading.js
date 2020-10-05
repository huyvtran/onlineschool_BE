const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const studentreading = sequelize.define('studentreading', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID: {
        type: Sequelize.STRING(5),
        allowNull: false,
    }
    ,
    CURRID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
     INSTCURID: {
        type: Sequelize.STRING(6),
        allowNull: true
    },
    CLASSID: {
        type: Sequelize.STRING(2),
        allowNull: true
    },
    INSTCURCLASSID: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: true
    },
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    },
    CURSUBCLASSLESID: {
        type: Sequelize.STRING(7),
        allowNull: true
    },
    TEACHERID: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    LESSIONPATH: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    LESSIONSTATUS: {
        type: Sequelize.INTEGER(30),
        allowNull: true
    },
    STUDENTID: {
        type: Sequelize.STRING(11),
        allowNull: true
    },
    COMPLETEDDATEANDTIME: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true
    }
});
module.exports = studentreading;








