const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const Op = Sequelize.Op;
const studentMaster = require('../models/studentMaster');
const teacherVideo = require('../models/teachervideo');
const studentsListening = require('../models/studentsListening');
const curriculamSubLessions = require('../models/curriculamSubLessions');
const curriculumMaster = require('../models/curriculumMaster');
const classMaster = require('../models/classMaster');
const teacherSubjects = require('../models/teacherSubjects');
const studentReading = require('../models/studentReading');
const studentVideoStatus = require('../models/studentVideoStatus');
const assignments = require('../models/assignments');
const studentleswiseassignmentstatus = require('../models/studentlessonwiseassignmentstatus');
module.exports = class StudentDAO {

    static getAllStudentDetails(studentId) {
        return studentMaster.findOne({
            where: {'STUDENTID': studentId}
        });
    }

    static getCurriculumNameById(currId) {
        return curriculumMaster.findOne({
            attributes: ['CURRICULUMNAME'],
            where: {'CURRID': currId}
        });
    }

    static getClassNameById(classId) {
        return classMaster.findOne({
            attributes: ['CLASSNAME'],
            where: {'CLASSID': classId}
        })
    }

    static getStudentSubjectDetails(studentId) {
        return sequelize.query(`select ss.CURSUBID, cs.SUBJECTID, sm.SUBJECTNAME, sm.CSSCLASS, sm.CSSIMAGE from
        studentsubjects ss inner join curriculumsubjects cs
        on ss.CURSUBID = cs.CURSUBID
        inner join subjectmasters sm
        on cs.SUBJECTID = sm.SUBJECTID
        where ss.STUDENTID = ` + studentId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getCountForLessons(subjectId) {
        return curriculamSubLessions.count({
            distinct: 'LESSIONNAME',
            where: {'SUBJECTID': subjectId}
        });
    }

    /* call to get lessons data -----> start */
    static getStudentLessonDetails(classId, currSubId) {
        return curriculamSubLessions.findAll({
            attributes: ['LESSIONID','CURSUBCLASSLESID','LESSIONNAME'],
            where: {'CLASSID': classId, 'CURSUBID': currSubId}
        });
    }

    static getTeacherVideoStatus(currSubClassLessId, instCurrClassSecId) {
        return teacherVideo.findAll({
            attributes: ['VIDEOSTATUS'],
            where: {'CURSUBCLASSSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId, 'VIDEOSTATUS': {
                [Op.ne]: 1
            }}
        });
    }

    static getTeacherAssignmentStatus(currSubClassLessId, instCurrClassSecId) {
        return assignments.findAll({
            attributes: ['ASSIGNMENTSTATUS'],
            where: {'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId, 'ASSIGNMENTSTATUS': {
                [Op.ne]: 1
            }}
        });
    }

    static getStudentVideoStatus(studentId, currSubClassLessId, instCurrClassSecId) {
        return studentVideoStatus.findOne({
            attributes: ['LISTENINGSTATUS'],
            where: {'STUDENTID': studentId, 'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getStudentAssignmentStatus(studentId, currSubClassLessId, instCurrClassSecId) {
        return studentleswiseassignmentstatus.findOne({
            attributes: ['ASSIGNMENTSTATUS'],
            where: {'STUDENTID': studentId, 'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getStudentReadingStatus(studentId, currSubClassLessId, instCurrClassSecId) {
        return studentReading.findOne({
            attributes: ['LESSIONSTATUS'],
            where: {'STUDENTID': studentId, 'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }
    /* call to get lessons data -----> end */

    static getVideoDetailsByLesson(currSubClassLessId, instCurrClassSecId, studentId) {
        /* return teacherVideo.findAll({
            where: {'CURSUBCLASSSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId, VIDEOSTATUS: {
                [Op.ne]: 1
            }}
        }); */
        return sequelize.query(`SELECT t.VIDEOID, t.VIDEOAUDIOPATH, t.VIDEOAUDIONAME, t.TEACHERREMARKS, s.LISTENINGSTATUS
        FROM teachervideos t left outer join studentlistenings s
        on t.VIDEOID = s.VIDEOID
        and s.STUDENTID = `+ studentId +`
        where t.CURSUBCLASSSLESID = `+ currSubClassLessId +` and t.INSTCURCLASSSECID = `+ instCurrClassSecId +` and t.VIDEOSTATUS != 1`, {
            type: Sequelize.QueryTypes.SELECT
        })
    }

    /* Student Listenings ===> Start */

    static getStudentListeningRecord(studentId, videoId) {
        return studentsListening.findOne({
            where: {'STUDENTID': studentId, 'VIDEOID': videoId}
        });
    }

    static saveStudentListenings(studentObj) {
        const studentListeningObj = {};
        studentListeningObj.VIDEOID = studentObj.videoId;
        studentListeningObj.STUDENTID = studentObj.studentId;
        studentListeningObj.LISTENINGSTATUS = studentObj.listeningStatus;
        studentListeningObj.CURSUBID = studentObj.currSubId;
        studentListeningObj.CURSUBCLASSLESID = studentObj.currSubClassLessId;
        studentListeningObj.INSTCURCLASSSECID = studentObj.instCurrClassSecId;

        return studentsListening.create(studentListeningObj);
    }

    static updateStudentListenings(studentObj) {
        return studentsListening.update({
            LISTENINGSTATUS: studentObj.listeningStatus
        }, {
            where: {'STUDENTID': studentObj.studentId, 'VIDEOID': studentObj.videoId}
        })
    }

    static getStudentLessonStatus(studentId, currSubClassLessId, instCurrClassSecId) {
        return studentVideoStatus.findOne({
            where: {STUDENTID: studentId, CURSUBCLASSLESID: currSubClassLessId, INSTCURCLASSSECID: instCurrClassSecId}
        });
    }

    static saveStudentLessonVideoStatus(studentObj) {
        const obj = {
            STUDENTID: studentObj.studentId,
            LISTENINGSTATUS: studentObj.listeningStatus,
            CURSUBID: studentObj.currSubId,
            CURSUBCLASSLESID: studentObj.currSubClassLessId,
            INSTCURCLASSSECID: studentObj.instCurrClassSecId,
        }
        return studentVideoStatus.create(obj);
    }

    static updateStudentLessonVideoStatus(studentObj, listeningStatus) {
        return studentVideoStatus.update({
            LISTENINGSTATUS: listeningStatus,
        }, {
            where: {STUDENTID: studentObj.studentId, CURSUBCLASSLESID: studentObj.currSubClassLessId, INSTCURCLASSSECID: studentObj.instCurrClassSecId}
        });
    }

    static updateTeacherVideoStatus(listeningStatus, videoId, instCurrClassSecId) {
        return teacherVideo.update({
            VIDEOSTATUS: listeningStatus
        }, {
            where: {VIDEOID: videoId, INSTCURCLASSSECID: instCurrClassSecId}
        });
    }

    static getStudentCountinSection(instCurrClassSecId, currSubId) {
       return sequelize.query(`select count(*) AS studentsCount from 
        studentsubjects where 
        INSTCURCLASSSECID = `+ instCurrClassSecId +` and CURSUBID = ` + currSubId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getVideosCountPerLessonForTeacher(currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) as totalVideosCountinLesson FROM onlineschool.teachervideos
        where CURSUBCLASSSLESID = `+ currSubClassLessId +` and INSTCURCLASSSECID = `+ instCurrClassSecId +` and VIDEOSTATUS != 1` , {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getVideosCountPerLessonForStudent(studentId, currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) AS studentVideosCountinLesson from 
        studentlistenings where
        STUDENTID = `+ studentId +` and CURSUBCLASSLESID = `+ currSubClassLessId + ` and INSTCURCLASSSECID = ` + instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getCompletedStudentCountinListening(studentId, currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) AS completedListeningCount from 
        studentlistenings where
        STUDENTID = `+ studentId +` and CURSUBCLASSLESID = `+ currSubClassLessId + ` and INSTCURCLASSSECID = ` + instCurrClassSecId + ` and LISTENINGSTATUS != 4`, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static getStudentCountinListening(videoId, currSubClassLessId, instCurrClassSecId) {
        return sequelize.query(`select count(*) AS listeningCount from 
        studentlistenings where 
        VIDEOID = `+ videoId +` and CURSUBCLASSLESID = `+ currSubClassLessId + ` and INSTCURCLASSSECID = ` + instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    /* Student Listenings ===> End */

    static getPdfUrl(curriculumName, className, subjectName, lessonId, lessonName) {
        let pdfString = 'D:/ONLINESCHOOL_NODE_DEV/online_school/' + curriculumName + '/' + className + '/' + subjectName + '/' + lessonId + '/Text/' + lessonName + '.pdf';
        return pdfString;
    }

    static getTeacherId(instCurrClassSecId, currSubId) {
        return teacherSubjects.findOne({
            attributes: ['TEACHERID'],
            where: {'INSTCURCLASSSECID': instCurrClassSecId, 'CURSUBID': currSubId}
        });
    }

    static getStudentReadingRecord(studentId, currSubClassLessId, instCurrClassSecId) {
        return studentReading.findOne({
            where: {'STUDENTID': studentId, 'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static saveStudentReadings(studentReadingObj) {
        return studentReading.create(studentReadingObj);
    }

    static updateStudentReadings(studentReadingObj) {
        return studentReading.update({
            LESSIONSTATUS: studentReadingObj.LESSIONSTATUS
        }, {
            where: {'STUDENTID': studentReadingObj.STUDENTID, 'CURSUBCLASSLESID': studentReadingObj.CURSUBCLASSLESID}
        })
    }
}