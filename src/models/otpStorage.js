const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const otp = sequelize.define('otp', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    loginid: {
        type: Sequelize.STRING,
        allowNull: false
    },
    mobilenumber: {
        type: Sequelize.STRING,
        allowNull: false
    },
    otp: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    purpose: {
        type: Sequelize.STRING,
        allowNull: true
    },
    generatedTime: {
        type: Sequelize.TIME,
        allowNull: true
    }
});
module.exports = otp;