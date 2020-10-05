const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const classmaster = sequelize.define('classmaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CLASSID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    CLASSNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = classmaster;