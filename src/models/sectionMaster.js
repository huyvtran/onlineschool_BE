const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const sectionmaster = sequelize.define('sectionmaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    SECTIONID: {
        type: Sequelize.INTEGER(2),
        allowNull: false,
    },
    SECTIONNAME: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    STATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    }
});
module.exports = sectionmaster;