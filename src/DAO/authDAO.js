const Login = require('../models/loginModel');
const studentmaster = require('../models/studentMaster');
const teachermaster = require('../models/teacherMaster');
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const sectionmaster = require('../models/sectionMaster');

module.exports = class AuthDAO {

    static findUser(loginid) {
        return Login.findOne({
            where: {'loginid': loginid}
        });
    }

    static updateUuid(uuid, loginid) {
        return Login.update({
            uuid: uuid
        },{ 
            where: {loginid: loginid}
        });
    }

    static getidbylogin(accesslevelid, groupid, loginid) {

        if(accesslevelid === '1' && groupid === '2') {
           return  teachermaster.findAll({
               attributes: ['TEACHERID'], 
               where: {'MOBILENO': loginid} 
            });
        }
        if(accesslevelid === '1' && groupid === '3') {
            return studentmaster.findAll({
                attributes: ['STUDENTID'], 
                where: {'INSTRROLLNUMBER': loginid} 
            });
        }
       
    }


    static getdatabylogintype(logintype, id){
        try{

            if(logintype === 1){
                return sequelize.query(`select  s.ROLLNO,c.CLASSNAME, se.SECTIONNAME, i.INSTITUTIOINNAME
                from studentmasters s 
                inner join institutionmasters i on s.INSTID = i.INSTID 
                inner join classmasters c on c.classid = s.classid
                inner join sectionmasters se on se.SECTIONID = substring(s.INSTCURCLASSSECID, 9, 9)        
                where s.STUDENTID = `+id, {
                type: Sequelize.QueryTypes.SELECT
                });
            }
            if(logintype === 2){            
                return sequelize.query(`select  i.INSTITUTIOINNAME
                from teachermasters t 
                inner join institutionmasters i 
                on t.INSTID = i.INSTID 
                where t.TEACHERID = `+id, {
                type: Sequelize.QueryTypes.SELECT
               });
            }
    
        }catch(error){
            console.log('error  ',error);
        }
        
    }
}