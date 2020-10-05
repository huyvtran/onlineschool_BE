const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const teachersubjects = sequelize.define('teachersubjects', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    CURRID: {
        type: Sequelize.INTEGER(61),
        allowNull: false,
    },
    TEACHERID: {
        type: Sequelize.STRING(3),
        allowNull: true
    },
    
    INSTCURID: {
        type: Sequelize.STRING(6),
        allowNull: true
    },
    
    INSTCURCLASSID: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: true
    },
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    }
    ,
    CLASSID: {
        type: Sequelize.STRING(2),
        allowNull: true
    },
    SECTIONID: {
        type: Sequelize.STRING(2),
        allowNull: false,
    },
});
module.exports = teachersubjects;








