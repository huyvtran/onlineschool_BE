const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const doubt = sequelize.define('doubts', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    CURRID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    INSTCURID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    ClassID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    INSTCURCLASSID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CURSUBID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CURSUBCLASSLESID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DOUBTSEQNO: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    DOUBTID: {
        type: Sequelize.STRING(16),
        allowNull: false
    },
    STUDENTID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    CREATEDATETIME: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    TEACHERID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING,
        allowNull: false
    },
    DOUBT: {
        type: Sequelize.STRING(2000),
        allowNull: false
    },
    ANSWER: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    DOUBTSTATUS: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    ANSWERDATETIME: {
        type: Sequelize.DATEONLY,
        allowNull: true
    }
});
module.exports = doubt;