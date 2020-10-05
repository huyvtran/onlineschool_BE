const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const teachervideo = sequelize.define('teachervideo', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID: {
        type: Sequelize.STRING(5),
        allowNull: false,
    },
    TEACHERID: {
        type: Sequelize.STRING(8),
        allowNull: true
    },
    CURRID: {
        type: Sequelize.INTEGER(62),
        allowNull: true
    }
    ,
    CLASSID: {
        type: Sequelize.STRING(6),
        allowNull: true
    }
    ,
    INSTCURCLASSID: {
        type: Sequelize.STRING(8),
        allowNull: true
    }
    ,
    CURSUBID: {
        type: Sequelize.STRING(3),
        allowNull: true
    }
    ,
    CURSUBCLASSSLESID: {
        type: Sequelize.STRING(8),
        allowNull: true
    }
    ,
    VIDEOSEQNO: {
        type: Sequelize.INTEGER(4),
        allowNull: true
    }
    ,
    VIDEOID: {
        type: Sequelize.STRING(15),
        allowNull: true
    },
    INSTCURCLASSSECID: {
        type: Sequelize.STRING(9),
        allowNull: true
    },
    VIDEOAUDIOPATH: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    VIDEOAUDIONAME: {
        type: Sequelize.STRING(255),
        allowNull: true
    },
    TEACHERREMARKS: {
        type: Sequelize.STRING(500),
        allowNull: true
    }
    ,
    VIDEOSTATUS: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    }
    ,
    LESSIONSLNO: {
        type: Sequelize.INTEGER(4),
        allowNull: true
    }
});
module.exports = teachervideo;








