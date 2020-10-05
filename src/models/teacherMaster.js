const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('teachermaster', {
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
    TEACHERID: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    
    TEACHERSEQ: {
        type: Sequelize.INTEGER(3),
        allowNull: true
    },
    SALUTATION: {
        type: Sequelize.STRING(5),
        allowNull: true
    }
    ,
    FIRSTNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
    ,
    LASTNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
    ,
    GENDER: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    }
    ,
    DESIGNATION: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    ,
    MOBILENO: {
        type: Sequelize.STRING(10),
        allowNull: true
    }
    ,
    EMAILID: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    IS_PRINCIPAL: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }

});
module.exports = messages;








