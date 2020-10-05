const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('institutetypemaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTTYPEID: {
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    INSTITUTETYPE: {
        type: Sequelize.STRING(30),
        allowNull: true
    }
    ,
    INSTITUTESEQID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
    STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;