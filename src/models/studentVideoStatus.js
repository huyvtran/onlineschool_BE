const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('studentVideoStatus', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    STUDENTID: {
        type: Sequelize.STRING(11),
        allowNull: true
    },
    LISTENINGSTATUS: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    },
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    },
    CURSUBCLASSLESID: {
        type: Sequelize.STRING(7),
        allowNull: true
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: true
    },
    COMPLETEDDATEANDTIME: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true
    }
});
module.exports = messages;








