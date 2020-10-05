const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const studentsub = sequelize.define('studentsubmissions', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ASSIGNMENTID:{
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    STUDENTID:{
        type: Sequelize.STRING(11),
        allowNull: false,
    },
    STUDENTATTEMPTID:{
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    SUBMISSIONSTATUS:{
        type: Sequelize.INTEGER(1),
        allowNull: false,
    },
    SUBMITTEDDATE:{
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    RECDMARKS:{
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    TOTALMARKS:{
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    PERCENT:{
        type: Sequelize.FLOAT(6),
        allowNull: false,
    },
    CURSUBID:{
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    INSTCURCLASSSECID:{
        type: Sequelize.STRING(9),
        allowNull: false,
    },
    CURSUBCLASSLESID:{
        type: Sequelize.STRING(7),
        allowNull: false,
    }
});
module.exports = studentsub;