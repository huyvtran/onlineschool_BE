const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const parentmaster = sequelize.define('parentmaster', {
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
    PARENTID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    },
    SALUTATION: {
        type: Sequelize.STRING(5),
        allowNull: true
    }
    ,
    FIRSTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    ,
    LASTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    ,
    GENDER: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    }
    ,
    STUDENTID: {
        type: Sequelize.STRING(11),
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
    }

});
module.exports = parentmaster;








