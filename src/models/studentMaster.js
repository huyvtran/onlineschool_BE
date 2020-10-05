const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const studentmaster = sequelize.define('studentmaster', {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    INSTID: {
        type: Sequelize.STRING(5),
        allowNull: false,
    }
    ,
    CURRID: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
     INSTCURID: {
        type: Sequelize.STRING(6),
        allowNull: true
    },
    CLASSID: {
        type: Sequelize.STRING(2),
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
    STUDENTSLNO: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    },
    STUDENTID: {
        type: Sequelize.STRING(11),
        allowNull: true
    },
    SALUTATION: {
        type: Sequelize.STRING(5),
        allowNull: true
    }
    ,
    FIRSTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    ,
    LASTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    }
    ,
    GENDER: {
        type: Sequelize.INTEGER(1),
        allowNull: true
    }
    ,
    ROLLNO: {
        type: Sequelize.STRING(6),
        allowNull: true
    }
    ,
    AGE: {
        type: Sequelize.INTEGER(2),
        allowNull: true
    }
    
   ,
    MOBILENO: {
        type: Sequelize.STRING(10),
        allowNull: true
    },
    EMAILID: {
        type: Sequelize.STRING(20),
        allowNull: true
    },
    FATHERID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    },
    FATHERSALUTATION: {
        type: Sequelize.STRING(5),
        allowNull: true
    },
    FATHERFIRSTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    },FATHERLASTNAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    },FATHERNUMBER: {
        type: Sequelize.STRING(10),
        allowNull: true
    },MOTHERFIRSTNAME: {
        type: Sequelize.STRING(20),
        allowNull: true
    },MOTHER_LASTT_NAME: {
        type: Sequelize.STRING(30),
        allowNull: true
    },MOTHERNUMBER: {
        type: Sequelize.STRING(10),
        allowNull: true
    },MOTHERID: {
        type: Sequelize.INTEGER(6),
        allowNull: true
    },
    INSTRROLLNUMBER: {
        type: Sequelize.STRING(11),
        allowNull: true
    }
});
module.exports = studentmaster;








