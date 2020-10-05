const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Login = sequelize.define('login', {

     loginid: {
          type: Sequelize.STRING,
          allowNull: false
     },
     password: {
          type: Sequelize.STRING,
          allowNull: false
     },

     username: {
          type: Sequelize.STRING,
          allowNull: false
     },
     isfirsttimelogin: {
          type: Sequelize.BOOLEAN,
          allowNull: false
     },
     mobileno: {
          type: Sequelize.STRING,
          allowNull: false
     },
     email: {
          type: Sequelize.STRING,
          allowNull: false
     },
     mpin: {
          type: Sequelize.STRING,
          allowNull: false
     },
     uuid: {
          type: Sequelize.STRING,
          allowNull: false
     },
     /* createddatetime: {
          type: Sequelize.DATE,
          allowNull: false
     }, */
     accesslevelid: {
          type: Sequelize.STRING,
          allowNull: false
     },
     institutionid: {
          type: Sequelize.STRING,
          allowNull: false
     },
     groupid: {
          type: Sequelize.STRING,
          allowNull: false
     },
     /* updateddatetime: {
          type: Sequelize.DATE,
          allowNull: false
     }, */
     updatedby: {
          type: Sequelize.STRING,
          allowNull: false
     }

});

module.exports = Login;