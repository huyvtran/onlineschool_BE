const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('principalmaster', {
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
    PRINCIPALID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    }
    ,
    INSTPRINCIPALID: {
        type: Sequelize.STRING(7),
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
        type: Sequelize.INTEGER(2),
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
    TELEPHONE: {
        type: Sequelize.STRING(12),
        allowNull: true
    }

});
module.exports = messages;








