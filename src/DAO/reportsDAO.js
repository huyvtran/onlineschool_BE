const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const teachervideo = require('../models/teachervideo');
const curriculamSubLessions = require('../models/curriculamSubLessions');
const doubt = require('../models/doubts');
const assignments = require('../models/assignments');
const studentSubjects = require('../models/studentSubjects');
const studentVideoStatus = require('../models/studentVideoStatus');
module.exports = class ReportsDAO {

    static getAllTeacherLessionDetails(teacherId, instCurrClassSecId, currSubClassLessId) {
        /* return sequelize.query(`select a.updatedAt,c.SUBJECTNAME,a.CURSUBCLASSSLESID,a.VIDEOSTATUS
        from teachervideos a 
        inner join curriculumsubjects b        
        on a.CURSUBID = b.CURSUBID         
        inner join subjectmasters c
        on b.SUBJECTID =c.SUBJECTID	     
        where a.TEACHERID = ` + teacherId, {
            type: Sequelize.QueryTypes.SELECT
        });  */
        return teachervideo.findAll({
            attributes: ['VIDEOAUDIONAME', 'TEACHERREMARKS', 'VIDEOSTATUS', 'createdAt', 'updatedAt'],
            where: {TEACHERID: teacherId, INSTCURCLASSSECID: instCurrClassSecId, CURSUBCLASSSLESID: currSubClassLessId}
        });
    }

    static getLessionNames(currSuClassLessId) {
        return curriculamSubLessions.findOne({
            attributes: ['LESSIONNAME'],
            where: {'CURSUBCLASSLESID': currSuClassLessId}
        });
    }


    static getAllTeacherDoubtClarifficationDetails(teacherId, instCurrClassSecId, currSubClassLessId) {
        /* return sequelize.query(`select a.updatedAt,c.SUBJECTNAME,a.CURSUBCLASSLESID,a.DOUBTSTATUS
        from doubts a 
        inner join curriculumsubjects b        
        on a.CURSUBID = b.CURSUBID         
        inner join subjectmasters c
        on b.SUBJECTID =c.SUBJECTID	     
        where a.TEACHERID = ` + teacherId, {
            type: Sequelize.QueryTypes.SELECT
        }); */
        return doubt.findAll({
            attributes: ['DOUBT', 'ANSWER', 'DOUBTSTATUS', 'createdAt', 'updatedAt'],
            where: {TEACHERID: teacherId, INSTCURCLASSSECID: instCurrClassSecId, CURSUBCLASSLESID: currSubClassLessId}
        });
    }

    static getAllTeacherAssignmentDetails(teacherId, instCurrClassSecId, currSubClassLessId) {
        /* return sequelize.query(`select a.ASSIGNMENTID,a.ASSIGNMENTMODE,a.updatedAt,c.SUBJECTNAME,a.CURSUBCLASSLESID,a.ASSIGNMENTSTATUS
        from assignments a 
        inner join curriculumsubjects b        
        on a.CURSUBID = b.CURSUBID         
        inner join subjectmasters c
        on b.SUBJECTID =c.SUBJECTID	     
        where a.TEACHERID = ` + teacherId, {
            type: Sequelize.QueryTypes.SELECT
        }); */
        return assignments.findAll({
            attributes: ['TITLE', 'ASSIGNMENTSTATUS', 'ASSIGNMENTMODE', 'TOTALMARKS', 'CREATEDBY', 'createdAt', 'updatedAt'],
            where: {TEACHERID: teacherId, INSTCURCLASSSECID: instCurrClassSecId, CURSUBCLASSLESID: currSubClassLessId}
        });
    }

    static getAllTeacherSubjectsByStudent(teacherId,currId,classId) {
        return sequelize.query(`select a.TEACHERID, c.SUBJECTNAME,a.CURSUBID,b.SUBJECTID,c.CSSCLASS,c.CSSIMAGE
        from teachersubjects a 
        inner join curriculumsubjects b        
        on a.CURSUBID = b.CURSUBID 
         inner join subjectmasters c
        on b.SUBJECTID =c.SUBJECTID
        where a.TEACHERID=` + teacherId+` and a.CURRID=` + currId+` and a.CLASSID=`+classId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getAllChapters(curId,subjectId,classId) {
        return sequelize.query(`select a.LESSIONNAME,a.LESSIONID,a.CURSUBCLASSLESID
        from curriculumsublessions a 
        where a.CURRID=`+curId+` and a.SUBJECTID=` + subjectId+` and a.CLASSID=`+classId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static getAllAssignmentsByTeacher(teacherId,curSubClassLesId) {
        return sequelize.query(`select distinct  ASSIGNMENTID ,TITLE,ASSIGNMENTSEQID,INSTCURCLASSSECID
        from assignments
        where TEACHERID=`+teacherId+` and CURSUBCLASSLESID=`+curSubClassLesId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }
    
    static getAssignmentStatusFromAssignments(teacherId) {
        return sequelize.query(`select distinct INSTCURCLASSSECID,ASSIGNMENTSTATUS from assignments where TEACHERID=`+teacherId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }
    static getAllAssignmentsByStudents(instCurClassSecId) {
        return sequelize.query(`select STUDENTID from studentmasters where INSTCURCLASSSECID=`+instCurClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static getAllStatusesByStudents(studentId,curSubClassLesId,assignmentId) {
        return sequelize.query(`select distinct a.STUDENTID,a.LISTENINGSTATUS,b.LESSIONSTATUS,c.SUBMISSIONSTATUS
        from studentlistenings a 
        inner join studentreadings b        
        on a.STUDENTID = b.STUDENTID 
         inner join studentsubmissions c
        on b.STUDENTID =c.STUDENTID        
        where a.STUDENTID = `+studentId+` and a.CURSUBCLASSLESID=`+curSubClassLesId+` and b.CURSUBCLASSLESID=`+curSubClassLesId+` and 
        c.ASSIGNMENTID=`+assignmentId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static getStudentsList(instCurrClassSecId, currSubId) {
        return studentSubjects.findAll({
            attributes: ['STUDENTID'],
            where: {INSTCURCLASSSECID: instCurrClassSecId, CURSUBID: currSubId}
        });
    }

    static getStudentStatus(instCurrClassSecId, currSubClassLessId, currSubId) {
        return sequelize.query(`SELECT ss.STUDENTID, sm.FIRSTNAME, sm.LASTNAME, sv.LISTENINGSTATUS, sr.LESSIONSTATUS, sa.ASSIGNMENTSTATUS
        from onlineschool.studentmasters sm 
        inner join onlineschool.studentsubjects ss  on ss.STUDENTID = sm.STUDENTID
        left outer join onlineschool.studentvideostatuses sv on ss.STUDENTID = sv.STUDENTID AND sv.CURSUBCLASSLESID = `+ currSubClassLessId +`
        left outer join onlineschool.studentreadings sr on sv.STUDENTID = sr.STUDENTID AND sr.CURSUBCLASSLESID = `+ currSubClassLessId +`
        left outer join onlineschool.studentleswiseassignmentstatuses sa on sr.STUDENTID = sa.STUDENTID AND sa.CURSUBCLASSLESID = `+ currSubClassLessId +`
        where ss.CURSUBID = `+ currSubId +` AND ss.INSTCURCLASSSECID = `+ instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }
}