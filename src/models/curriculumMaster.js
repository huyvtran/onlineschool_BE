const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const curriculummaster = sequelize.define('curriculummaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CURRID: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
    },
    CURRICULUMNAME: {
        type: Sequelize.STRING(15),
        allowNull: true
    }
});
module.exports = curriculummaster;