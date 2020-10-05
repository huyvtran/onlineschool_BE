const Sequelize = require('sequelize');
const sequelize = require('../util/database');



const studentsubqtns = sequelize.define('studentsubmissionqtns', {
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
    ASSIGNMENTQNID:{
        type: Sequelize.STRING(18),
        allowNull: false,
    },
    SELECTEDOPTION:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    ANSWER:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    ISITCORRECT:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }


});
module.exports = studentsubqtns;