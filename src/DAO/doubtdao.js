const studentmaster = require('../models/studentMaster');
const teachersubject = require('../models/teacherSubjects');
const teachetmaster = require('../models/teacherMaster');
const sequelize = require('../util/database');
const doubt = require('../models/doubts');
const cursublession = require('../models/curriculamSubLessions');
const subjects = require('../models/subjectMaster');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

 
module.exports = class Doubtdao {


    static getmaxseqno(){
        return doubt.findAll({attributes: [sequelize.fn('MAX', sequelize.col('DOUBTSEQNO'))]});
    }

    static getstudentdetials(studentid){
        return studentmaster.findAll({attributes: ['FIRSTNAME','LASTNAME','CURRID','INSTCURID','CLASSID','INSTCURCLASSID','INSTCURCLASSSECID'], where: {'STUDENTID': studentid} });
    }
    static getteacherid(result,cursubid){
       return teachersubject.findAll({
            attributes: ['TEACHERID'], where: {'CURRID': result.CURRID, 'INSTCURID': result.INSTCURID, 'CLASSID': result.CLASSID, 'INSTCURCLASSID': result.INSTCURCLASSID, 'INSTCURCLASSSECID': result.INSTCURCLASSSECID, 'CURSUBID':cursubid} });           
    }

    static createdoubt(doubtobj){
        return doubt.create(doubtobj);
    }

    static getdoubtsdata(doubtsfor,isanswered,frmdate,todate,studentid,logintype,subid,lesid,instid,secid){
        
        if(doubtsfor == 1){  
          
            return (logintype === 1) ? doubt.findAll({attributes: isanswered== 1 ?['id','DOUBT']:['id','DOUBT','ANSWER'], 
                                    where: {
                                    'STUDENTID': studentid, 
                                    'CREATEDATETIME':{[Op.between]: [frmdate,todate]}, 
                                    'DOUBTSTATUS':isanswered,
                                    'CURSUBID':subid,
                                    'CURSUBCLASSLESID':lesid 
                                    }
                         })
                                    :  doubt.findAll({attributes: isanswered== 1 ?['id','DOUBT']:['id','DOUBT','ANSWER'], 
                                    where: {
                                    'TEACHERID': studentid, 
                                    'CREATEDATETIME':{[Op.between]: [frmdate,todate]}, 
                                    'DOUBTSTATUS':isanswered,
                                    'CURSUBID':subid,
                                    'CURSUBCLASSLESID':lesid,
                                    'INSTCURCLASSSECID':secid
                                    }
                         })
                         
        }

        if(doubtsfor == 2){
            return doubt.findAll({attributes: isanswered== 1 ?['id','DOUBT']:['id','DOUBT','ANSWER'], 
                where: {
                        'CREATEDATETIME': {[Op.between]:[frmdate,todate] },
                        'DOUBTSTATUS':isanswered,
                        'CURSUBID':subid,
                        'CURSUBCLASSLESID':lesid,
                        'INSTCURCLASSSECID':secid,
                        'INSTID':instid
                       } 
                });
        }
    }

    static updateanswer(answer, date,id,teacherid) {
        return doubt.update({
            ANSWER: answer, ANSWERDATETIME: date, DOUBTSTATUS:2,TEACHERID: teacherid
        },{ 
            where: {id: id}
        });
    }

    static getteachermobileno(teacherid){
        return teachetmaster.findAll({
             attributes: ['MOBILENO'], where: {'TEACHERID': teacherid} });           
     }

    static getlessonid(id){
        return doubt.findAll({
            attributes: ['STUDENTID','CURSUBCLASSLESID','CURSUBID'], where: {'id': id} });
    }

    static getstudentmobileno(studentid){
        return studentmaster.findAll({
            attributes: ['MOBILENO'], where: {'STUDENTID': studentid} });
    }

    static getlessonandsubject(lesid,cursubid){
        return sequelize.query(`select  c.LESSIONNAME ,s.SUBJECTNAME, cm.CLASSNAME
        from curriculumsublessions c 
        inner join subjectmasters s  on c.SUBJECTID = s.SUBJECTID 
        inner join classmasters cm on c.CLASSID = cm.CLASSID
        where c.CURSUBID = `+cursubid+` and c.CURSUBCLASSLESID = ` + lesid, {
           type: Sequelize.QueryTypes.SELECT
       });
    }

    
}