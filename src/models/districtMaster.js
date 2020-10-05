const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('districtmaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    DISTRICT: {
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
    }
    ,STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = messages;