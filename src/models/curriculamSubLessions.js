const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('curriculumsublessions', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CURRID: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    },
    SUBJECTID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    }
    ,
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    }
    ,
    CLASSID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    }
    ,
    LESSIONID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    }
    ,
    CURSUBCLASSLESID: {
        type: Sequelize.STRING(7),
        allowNull: true
    },
    LESSIONNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    },
    LESSIONPATH: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
});
module.exports = messages;