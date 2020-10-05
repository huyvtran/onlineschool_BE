const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('instituteclasses', {
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
    ,
    INSTCURCLASSID: {
        type: Sequelize.STRING(8),
        allowNull: true
    }
    ,
    CLASSID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
    SECTIONID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    }
    ,
    INSTCURCLASSSECID    : {
        type: Sequelize.STRING(9),
        allowNull: true
    },
    CLASSTEACHERID    : {
        type: Sequelize.STRING(4),
        allowNull: true
    }
    ,
    STRENGTH: {
        type: Sequelize.INTEGER(8),
        allowNull: true
    }
});
module.exports = messages;