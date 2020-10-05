const Sequelize = require('sequelize');
const sequelize = require('../util/database');
//const aq = require('./assignmentqn');

const assigment = sequelize.define('assignment', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID:{
        type: Sequelize.STRING(5),
        allowNull: false,
    },
    CURRID:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    INSTCURID:{
        type: Sequelize.STRING(6),
        allowNull: false,
    },
    CLASSID:{
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    INSTCURCLASSID:{
        type: Sequelize.STRING(8),
        allowNull: false,
    },
    CURSUBID:{
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    CURSUBCLASSLESID:{
        type: Sequelize.STRING(7),
        allowNull: false,
    },
    TITLE:{
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    ASSIGNMENTSEQID:{
        type: Sequelize.INTEGER(4),
        allowNull: false,
    },
    ASSIGNMENTID:{
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    TEACHERID:{
        type: Sequelize.STRING(8),
        allowNull: false,
    },
    INSTCURCLASSSECID:{
        type: Sequelize.STRING(9),
        allowNull: false,
    },
    ASSIGNMENTSTATUS:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    LESSONSLNO:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    ASSIGNMENTMODE:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    TOTALMARKS:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    CREATEDBY:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    CREATEDDATE:{
        type: Sequelize.DATEONLY,
        allowNull: false,
    }

});
module.exports = assigment;