const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const messages = sequelize.define('assignmentquestionaire', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    ASSIGNMENT_ID: {
        type: Sequelize.INTEGER(6),
        allowNull: false,
    },
    INSTITUTION_ID: {
        type: Sequelize.INTEGER(6),
        allowNull: false,
    },
    STUDENT_ID: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    SECTION_ID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    }
    ,
    CLASS_ID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    }
    ,
    QUESTION: {
        type: Sequelize.STRING,
        allowNull: true
    }
    ,
    ANSWER: {
        type: Sequelize.TEXT,
        allowNull: true
    }

});
module.exports = messages;








