
const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('citymaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    NAME: {
        type: Sequelize.STRING(20),
        allowNull: false,
    }
    ,COUNTRYID: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
    ,STATEID: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    DISTRICTID: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
    ,STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;