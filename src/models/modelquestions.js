const Sequelize = require('sequelize');
const sequelize = require('../util/database');


const mq = sequelize.define('modelquestions', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },    
    CURRID:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    CLASSID:{
        type: Sequelize.STRING(3),
        allowNull: false,
    },
    CURSUBID:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    CURSUBCLASSLESID:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    TITLE:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    LESSONSLNO:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    QTNSLNO:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    QTN:{
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    OP1:{
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    OP2:{
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    OP3:{
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    OP4:{
        type: Sequelize.STRING(500),
        allowNull: false,
    },
    ANSWER:{
        type: Sequelize.STRING(500),
        allowNull: false,
    }
});
module.exports = mq;