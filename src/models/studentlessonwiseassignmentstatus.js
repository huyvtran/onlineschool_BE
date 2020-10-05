
const { Model, Sequelize } = require("sequelize");
const sequelize = require('../util/database')

const messages = sequelize.define('studentleswiseassignmentstatus', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    STUDENTID: {
        type: Sequelize.STRING(11),
        allowNull: false
    }, 
    ASSIGNMENTSTATUS: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },  
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    },
    CURSUBCLASSLESID: {
        type: Sequelize.STRING(7),
        allowNull: false
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: false
    },
    COMPLETEDDATEANDTIME: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true
    }
});

module.exports = messages;


