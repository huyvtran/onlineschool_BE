const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const aq = sequelize.define('assignmentqtns', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ASSIGNMENTID:{
        type: Sequelize.STRING(15),
        allowNull: false,
    },
    QNSLNO:{
        type: Sequelize.INTEGER(3),
        allowNull: false,
    },
    ASSIGNMENTQNID:{
        type: Sequelize.STRING(18),
        allowNull: false,
    },
    ANSWER:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    ASSIGNMENTQN:{
        type: Sequelize.STRING(1000),
        allowNull: false,
    },
    OP1:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    OP2:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    OP3:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    OP4:{
        type: Sequelize.STRING(200),
        allowNull: false,
    },
    CHK1:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    CHK2:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    CHK3:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    CHK4:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    }

});
module.exports = aq;