const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('curriculumsubjects', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CURRID: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    },
    SUBJECTID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    }
});
module.exports = messages;