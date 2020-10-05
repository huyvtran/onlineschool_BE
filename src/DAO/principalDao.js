
const sequelize = require('../util/database');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const cursublessions = require('../models/curriculamSubLessions');
const studentmaster = require('../models/studentMaster');
const studentvideostatus = require('../models/studentVideoStatus');
const curriculumSubLessons = require('../models/curriculamSubLessions');
const studentlessonwiseassignmentstatus = require('../models/studentlessonwiseassignmentstatus');
const teachermasters = require('../models/teacherMaster');
const teacherVideos = require('../models/teachervideo');
const assignments = require('../models/assignments');

module.exports = class principalDao {


    static getstudentoverview(instid) {
        return sequelize.query(`select  count(sm.STUDENTID) as totalstudents, cm.CLASSNAME
		from studentmasters sm
		inner join classmasters cm on cm.CLASSID = sm.CLASSID      
		 where sm.INSTID =`+ instid + ` group by sm.CLASSID `, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getsubjectoverview(instid) {
        return sequelize.query(`select count(tm.TEACHERID) as teacher,  sm.SUBJECTNAME from 
        teachermasters tm
        inner join teachersubjects ts on tm.TEACHERID = ts.TEACHERID
        inner join  curriculumsubjects cs on cs.CURSUBID = ts.CURSUBID
        inner join subjectmasters sm on sm.SUBJECTID = cs.SUBJECTID
        where tm.INSTID = `+ instid + ` group by ts.CURSUBID `, {
            type: Sequelize.QueryTypes.SELECT
        });
    }


    static getassignmentscompletedstudents(sub, sec) {
        /*  return sequelize.query(`select count(ss.SUBMISSIONSTATUS) as completed from studentsubmissions ss
         inner join studentsubjects ssub on ss.STUDENTID = ssub.STUDENTID and ssub.CURSUBID = `+sub+` and ssub.INSTCURCLASSSECID = `+sec+`
         where ss.SUBMISSIONSTATUS = 2`,{
         type: Sequelize.QueryTypes.SELECT
         }); */

        return sequelize.query(`select count(ASSIGNMENTID) as completed, ASSIGNMENTSTATUS as STATUS from assignments 
        where CURSUBID = `+ sub + ` and INSTCURCLASSSECID = ` + sec + ` group by ASSIGNMENTSTATUS`, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getvideoscompletedstudents(sub, sec) {
        return sequelize.query(`select count(VIDEOID) as completed, VIDEOSTATUS as STATUS from teachervideos 
        where CURSUBID = `+ sub + ` and INSTCURCLASSSECID = ` + sec + ` group by VIDEOSTATUS`, {
            type: Sequelize.QueryTypes.SELECT
        });
    }


    static getCurriculumByInstId(instid) {
        return sequelize.query(`select ic.INSTCURID, cc.CURRICULUMNAME from institutecurriculums ic inner join curriculummasters cc on cc.CURRID = ic.CURRID
        where ic.INSTID = `+ instid, {
            type: Sequelize.QueryTypes.SELECT
        })
    }

    static getClassesByInstCurId(instCurId) {
        return sequelize.query(`select distinct ic.CLASSID, ic.INSTCURCLASSID, cm.CLASSNAME from instituteclasses ic inner join classmasters cm on cm.CLASSID = ic.CLASSID
        where ic.INSTCURID = `+ instCurId, {
            type: Sequelize.QueryTypes.SELECT
        })
    }

    static getsectionsByInstCurClassId(instCurClassId) {
        return sequelize.query(`select distinct ic.SECTIONID, ic.INSTCURCLASSSECID, sm.SECTIONNAME from instituteclasses ic inner join sectionmasters sm on sm.SECTIONID = ic.SECTIONID
        where ic.INSTCURCLASSID = `+ instCurClassId, {
            type: Sequelize.QueryTypes.SELECT
        })
    }

    static getStudentSubjects(studentId, instCurrClassSecId) {
        return sequelize.query(`select ss.CURSUBID, cs.SUBJECTID, sm.SUBJECTNAME from studentsubjects ss 
        inner join curriculumsubjects cs on ss.CURSUBID = cs.CURSUBID
        inner join subjectmasters sm on cs.SUBJECTID = sm.SUBJECTID
        where ss.STUDENTID = `+ studentId +` and INSTCURCLASSSECID = ` + instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getTeacherSubjects(teacherId, instCurrClassSecId) {
        return sequelize.query(`select ts.CURSUBID, cs.SUBJECTID, sm.SUBJECTNAME from teachersubjects ts 
        inner join curriculumsubjects cs on ts.CURSUBID = cs.CURSUBID
        inner join subjectmasters sm on cs.SUBJECTID = sm.SUBJECTID
        where ts.TEACHERID = `+ teacherId +` and INSTCURCLASSSECID = ` + instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getSubjectLessonsCount(classId, curSubId) {
        return curriculumSubLessons.count({
            where: {CLASSID: classId, CURSUBID: curSubId}
        });
    }

    static getSubjectLessons(classId, curSubId) {
        return curriculumSubLessons.findAll({
            attributes: ['CURSUBCLASSLESID', 'LESSIONNAME'],
            where: {CLASSID: classId, CURSUBID: curSubId},
            raw: true
        });
    }

    static getStudentsByInstCurClassSecId(instCurClassSecId) {
        return studentmaster.findAll({
            attributes: ['STUDENTID', 'STUDENTID', 'FIRSTNAME', 'LASTNAME'],
            where: {'INSTCURCLASSSECID': instCurClassSecId}
        });
    }

    static getStudentVideoStatus(studentId, curSubId, listeningStatus) {
        return studentvideostatus.count({
            where: {STUDENTID: studentId, CURSUBID: curSubId, LISTENINGSTATUS: listeningStatus}
        });
    }

    static getStudentAssignmentStatus(studentId, curSubId, assignmentStatus) {
        return studentlessonwiseassignmentstatus.count({
            where: {STUDENTID: studentId, CURSUBID: curSubId, ASSIGNMENTSTATUS: assignmentStatus}
        });
    }

    static getTeachersByInstId(instId) {
        return teachermasters.findAll({
            attributes: ['TEACHERID', 'SALUTATION', 'SALUTATION', 'FIRSTNAME', 'LASTNAME', 'MOBILENO'],
            where: {INSTID: instId}
        });
    }

    static getTeacherVideoStatus(teacherId, curSubClassLessId, videoStatus) {
        return teacherVideos.count({
            where: {TEACHERID: teacherId, CURSUBCLASSSLESID: curSubClassLessId, VIDEOSTATUS: videoStatus},
        });
    }

    static getTeacherAssignmentStatus(teacherId, curSubClassLessId, assignmentStatus) {
        return assignments.count({
            where: {TEACHERID: teacherId, CURSUBCLASSLESID: curSubClassLessId, ASSIGNMENTSTATUS: assignmentStatus}
        });
    }





    static getcurrculimsubects(currculimid) {
        return sequelize.query(`select distinct cs.CURSUBID,sm.SUBJECTNAME from curriculumsubjects cs inner join subjectmasters sm on sm.SUBJECTID = cs.SUBJECTID
        where cs.CURRID = `+ currculimid, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getlessioncount(cursubid, classid) {
        return cursublessions.count({ distinct: 'CURSUBCLASSLESID', where: { 'CLASSID': classid, 'CURSUBID': cursubid } })
    }

    static getstudentsbyinstid(instcurclasssecid) {
        return studentmaster.findAll({ attributes: ['STUDENTID'], where: { 'INSTCURCLASSSECID': instcurclasssecid } })
    }

    static getvideostatusbystudent(cursubid, secid, studentid) {
        return sequelize.query(`SELECT count(CURSUBCLASSLESID) as completed, LISTENINGSTATUS as STATUS from studentvideostatuses
         where STUDENTID = `+ studentid + ` and INSTCURCLASSSECID =` + secid, {
            type: Sequelize.QueryTypes.SELECT
        })//CURSUBID = `+cursubid+` and 
    }

    static getassignmentstatusbystudent(cursubid, secid, studentid) {
        return sequelize.query(`select count(distinct ss.ASSIGNMENTID) as completed, ss.SUBMISSIONSTATUS as STATUS from onlineschool.studentsubmissions ss 
        inner join onlineschool.assignments a on a.ASSIGNMENTID = ss.ASSIGNMENTID and a.INSTCURCLASSSECID = `+ secid + ` and a.CURSUBID =` + cursubid + `
        where ss.STUDENTID = `+ studentid + ` group by ss.SUBMISSIONSTATUS`, {
            type: Sequelize.QueryTypes.SELECT
        })
    }

    static gettotalstudentsBysecandsuject(sub, sec) {
        return sequelize.query(`select count(sm.STUDENTID) as studentcount from studentmasters sm 
        inner join studentsubjects ssub on sm.STUDENTID = ssub.STUDENTID 
        and ssub.CURSUBID = `+ sub + ` and ssub.INSTCURCLASSSECID = ` + sec, {
            type: Sequelize.QueryTypes.SELECT
        });
    }
    static getreadingcompletedstudents(sub, sec) {
        return sequelize.query(`SELECT count(STUDENTID) as readingcompleted FROM onlineschool.studentreadings 
        where CURSUBID = `+ sub + ` and INSTCURCLASSSECID = ` + sec + ` and LESSIONSTATUS = 4`, {
            type: Sequelize.QueryTypes.SELECT
        });
    }
}