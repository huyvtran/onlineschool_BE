const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('institutionmaster', {
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
    INSTITUTESEQ: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
    },
    INSTITUTIOINNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
    ,
    INSTTYPEID: {
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    REGISTRATION_NO: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    
    LOGO: {
        type: Sequelize.BLOB,
        allowNull: false,
    },
    PUPILSTRENGTH: {
        type: Sequelize.INTEGER(6),
        allowNull: false,
    },
    ADDRESS1: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    ADDRESS2: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    CITY: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
    },
    DISTRICT: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    STATE: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    COUNTRY: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    PINCODE: {
        type: Sequelize.STRING(6),
        allowNull: false,
    },
    LANDING_PAGE_IMAGE: {
        type: Sequelize.BLOB,
        allowNull: false,
    },PHONE1: {
        type: Sequelize.STRING(12),
        allowNull: false,
    },PHONE2: {
        type: Sequelize.STRING(12),
        allowNull: false,
    },
    MOBILE_NUMBER: {
        type: Sequelize.STRING(10),
        allowNull: false,
    },
    CONTACTMAILID: {
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;