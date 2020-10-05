const assignment = require('../models/assignments');
const assignmentqtn =require('../models/assignmentqn');
const teachersubject = require('../models/teacherSubjects');
const curcumsublessions = require('../models/curriculamSubLessions');
const modelpaper = require('../models/modelquestions');
const sequelize = require('../util/database');
const studentsubmission = require('../models/studentsubmission');
const studentsubject = require('../models/studentSubjects');
const studentmaster = require('../models/studentMaster');
const studentsubmisstionqtns = require('../models/studentsubmissionqns');
const studentleswiseassignmentstatus = require('../models/studentlessonwiseassignmentstatus');
const Sequelize = require('sequelize');
const { count } = require('../models/assignments');
const Op = Sequelize.Op;

module.exports = class assignmentdao {

    static getteacherdata(teacherid,cursubid){
        return teachersubject.findAll({
             attributes: ['CURRID','INSTCURID','CLASSID','INSTCURCLASSID','INSTCURCLASSSECID'], where: {'TEACHERID': teacherid, 'CURSUBID':cursubid} });           
     }

    static getlessionid(classlesid){
        return curcumsublessions.findAll({
            attributes: ['LESSIONID'], where: {'CURSUBCLASSLESID': classlesid} });
    }

    static async saveassignment(obj,ary){

        const t = await sequelize.transaction();
        try{
        await assignment.create(obj,{transaction: t});
        await assignmentqtn.bulkCreate(ary,{transaction:t});      
        await t.commit();
        return true;
        }
        catch(error){
            console.log('database error - saveassignment() ',error);
            await t.rollback();
            return false;
        }     
    }

    static getquestionseqno() {   
        return assignmentqtn.max('QNSLNO');
    }

    static getassignmentseq(secid,subid) {
        return assignment.max('ASSIGNMENTSEQID',{where: {'INSTCURCLASSSECID':secid, 'CURSUBID' : subid}})                       
    }
    static addquestion(obj){
        return assignmentqtn.create(obj);
    }

    static getmodelquestions(classid,cursubid){
        return modelpaper.findAll({
             attributes: ['QTN','OP1','OP2','OP3','OP4','ANSWER'], where: {'CLASSID': classid, 'CURSUBID':cursubid} });           
     }

     static getaddedassignments(teeacherid,subid,lessonid,classid){
        return assignment.findAll({attributes: ['ASSIGNMENTID','TITLE','ASSIGNMENTSTATUS',
           [Sequelize.fn('date_format', Sequelize.col('CREATEDDATE'), '%d-%m-%Y'), 'CREATEDDATE']
        ]   
        , where: {'CLASSID': classid, 'CURSUBID':subid,'TEACHERID':teeacherid,'CURSUBCLASSLESID':lessonid}
     });
     }
    
     static getassignmentqtnbyid(assignmentid){
        return assignmentqtn.findAll({attributes: ['ASSIGNMENTQN','OP1','OP2','OP3','OP4','CHK1','CHK2','CHK3','CHK4'],
            where:{'ASSIGNMENTID': assignmentid}
        });
     }

     static getassignmentbyid(assignmentid){
        return assignment.findAll({           
            where:{'ASSIGNMENTID': assignmentid}
         });
     }

     static async saveassignmentbyid(obj,ary){

        const t = await sequelize.transaction();
        try{
         console.log(obj,ary);

        await assignment.update(obj,{where:{id : obj.id}},{transaction: t});
        await assignmentqtn.destroy({where:{ASSIGNMENTID : obj.ASSIGNMENTID}},{transaction: t})
        await assignmentqtn.bulkCreate(ary,{transaction:t});      
        await t.commit();
        return true;
        }
        catch(error){
            console.log('database error - saveassignment() ',error);
            await t.rollback();
            return false;
        }     
    }

    static getstudentattempid(studentid,assignmentid) {        
        return studentsubmission.max('STUDENTATTEMPTID',{where: {'STUDENTID' : studentid,'ASSIGNMENTID' : assignmentid}});
    }

    static getnoofqtns(assignmentid){
        return assignmentqtn.count({distinct:'ASSIGNMENTQNID', where: {'ASSIGNMENTID' : assignmentid} })
    }

    static async savesubmission(obj){        
        const t = await sequelize.transaction();
        try{
            await studentsubmission.create(obj.submission,{transaction: t});        
            await studentsubmisstionqtns.bulkCreate(obj.ary,{transaction:t}); 
            await t.commit();
            return true;
        }
        catch(error){
            console.log('database error - savesubmission() ',error);
            await t.rollback();
            return false;
        }     
    }

    static async getstudentleswisestatusrecord(studentId, currsubclasslessid, instcurrclasssecid) {
        return studentleswiseassignmentstatus.findOne({
            where: {STUDENTID: studentId, CURSUBCLASSLESID: currsubclasslessid, INSTCURCLASSSECID: instcurrclasssecid}
        });
    }

    static async updatestudentleswisestatusrecord(studObj) {
        return studentleswiseassignmentstatus.update({
            ASSIGNMENTSTATUS: studObj.ASSIGNMENTSTATUS
        }, {
            where: {STUDENTID: studObj.STUDENTID, CURSUBCLASSLESID: studObj.CURSUBCLASSLESID, INSTCURCLASSSECID: studObj.INSTCURCLASSSECID}
        })
    }

    static getAssignmentCountPerLessonForTeacher(currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) as totalAssignmentCountinLesson FROM assignments
        where CURSUBCLASSLESID = `+ currSubClassLessId +` and INSTCURCLASSSECID = `+ instCurrClassSecId +` and ASSIGNMENTSTATUS != 1` , {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getAssignmentCountPerLessonForStudent(studentId, currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) AS studentAssignmentCountinLesson from 
        studentsubmissions where
        STUDENTID = `+ studentId +` and CURSUBCLASSLESID = `+ currSubClassLessId + ` and INSTCURCLASSSECID = ` + instCurrClassSecId +` and SUBMISSIONSTATUS = 2`, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static savestudentleswisesubmission(obj) {
        return studentleswiseassignmentstatus.create(obj);
        /* const t = await sequelize.transaction();
        try {
            await studentleswiseassignmentstatus.create(obj, {transaction: t});
            await t.commit();
            return true;
        }
        catch(error) {
            await t.rollback();
            return false;
        } */
    }

    static getnoofstudentsforsec(secid,currsubid){
       return studentsubject.count({distinct:'STUDENTID', where:{'INSTCURCLASSSECID':secid,'CURSUBID':currsubid}});
    }

    static fetchsubmittedstudents(assignmentid){        
        return studentsubmission.count({distinct:'STUDENTID', where: {'ASSIGNMENTID' : assignmentid} });
    }

    static updateassignmentstatus(obj,assignmentid){        
        return assignment.update(obj, {where:{ASSIGNMENTID : assignmentid}});
    }

    static fetchassignmentsforstudents(secid,subid,lesid){
      return assignment.findAll({attributes: ['ASSIGNMENTID','TITLE','ASSIGNMENTSTATUS',
          [Sequelize.fn('date_format', Sequelize.col('CREATEDDATE'), '%d-%m-%Y'), 'CREATEDDATE']
         ],
          where:{'CURSUBID':subid,'INSTCURCLASSSECID':secid,'CURSUBCLASSLESID':lesid, 'ASSIGNMENTSTATUS' : {[Op.in]:[2,3,4]}}
      });
    }

    static fetchassignmentbyid(assignmentid){
        return assignment.findAll({ attributes: ['ASSIGNMENTID','TOTALMARKS'],         
            where:{'ASSIGNMENTID': assignmentid}
         });
    }

    static fetchassignmentqtnsbyid(assignmentid){
        return assignmentqtn.findAll({attributes: ['ASSIGNMENTQN','OP1','OP2','OP3','OP4','ANSWER','ASSIGNMENTQNID'],
            where:{'ASSIGNMENTID': assignmentid}
        });
    }

    static getsubmissionstatus(assignmentid,studentid){
        return studentsubmission.findOne({
            attributes: ['SUBMISSIONSTATUS'],
            where:{'ASSIGNMENTID': assignmentid, 'STUDENTID':studentid},
            order:[['STUDENTATTEMPTID', 'DESC']]
        })
    }

    static getstudentresults(assignmentid,studentid){
        return studentsubmission.findAll({
            attributes: ['STUDENTATTEMPTID','RECDMARKS'],
            where:{'ASSIGNMENTID': assignmentid, 'STUDENTID':studentid}
        })
    }
}