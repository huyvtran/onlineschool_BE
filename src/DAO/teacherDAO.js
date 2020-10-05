const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../util/database');
const alActivities = require('../models/alActivities');
const curriculamSubLessions = require('../models/curriculamSubLessions');
const teacherVideo = require('../models/teachervideo');
const teacherMaster = require('../models/teacherMaster');
const studentVideoStatus = require('../models/studentVideoStatus');
const assignments = require('../models/assignments');
const studentleswiseassignmentstatus = require('../models/studentlessonwiseassignmentstatus');

module.exports = class TeacherDAO {

    static getAllTeacherDetails(teacherId) {
        return teacherMaster.findOne({
            where: {'TEACHERID': teacherId}
        });
    }

    /* Call to get Curriculums ------> Start */

    static getTeacherId(mobileno) {
        return teacherMaster.findOne({
            attributes: ['TEACHERID'],
            where: {'MOBILENO': mobileno}
        });
    }

    static getCurriculumDetails(teacherId) {
       return sequelize.query(`select distinct t.TEACHERID, t.INSTCURID, t.CURRID, c.CURRICULUMNAME 
        from teachersubjects t 
        inner join curriculummasters c 
        on t.CURRID = c.CURRID 
        where t.TEACHERID = ` + teacherId, {
           type: Sequelize.QueryTypes.SELECT
       });
    }

    /* Call to get Curriculums ------> End */

    /* Call to get Classes ------> Start */

    static getClasses(teacherId, instCurrId) {
        return sequelize.query(`select distinct t.TEACHERID, t.INSTCURCLASSID, t.CLASSID, c.CLASSNAME 
        from teachersubjects t 
        inner join classmasters c 
        on t.CLASSID = c.CLASSID 
        where t.TEACHERID = ` + teacherId + ` and t.INSTCURID = ` + instCurrId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    /* Call to get Classes ------> End */

    /* Call to get Sections ------> Start */

    static getSectionDetails(teacherId, instCurrClassId) {
        return sequelize.query(`select distinct t.TEACHERID, t.INSTCURCLASSSECID, t.SECTIONID, s.SECTIONNAME
        from teachersubjects t
        inner join sectionmasters s 
        on t.SECTIONID = s.SECTIONID
        where t.TEACHERID = ` + teacherId + ` and t.INSTCURCLASSID = ` + instCurrClassId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    /* Call to get Sections ------> End */

    /* Call to get Activities ------> Start */

    static getActivityDetails(accesslevelid, groupid) {
        return alActivities.findAll({
            attributes: ['ACTIVITYID', 'ACTIVITYNAME', 'ALACTIVITYID', 'CSSCLASS'],
            where: {'ACCESSLEVELID': accesslevelid, 'GROUPID': groupid}
        });
    }

    /* Call to get Activities ------> End */

    /* Call to get Subjects ------> Start */

    /* Method 1 */
    static getTeacherSubjectDetails(teacherId, instCurrClassSecId) {
        return sequelize.query(`select t.CURSUBID, c.SUBJECTID, s.SUBJECTNAME, s.CSSCLASS, s.CSSIMAGE from
        teachersubjects t inner join curriculumsubjects c
        on t.CURSUBID = c.CURSUBID
        inner join subjectmasters s
        on c.SUBJECTID = s.SUBJECTID
        where t.TEACHERID = ` + teacherId + ` and t.INSTCURCLASSSECID = ` + instCurrClassSecId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static getCountForLessons(subjectId) {
        return curriculamSubLessions.count({
            distinct: 'LESSIONNAME',
            where: {'SUBJECTID': subjectId}
        });
    }

    /* Method 2 */
    /* static getCurrSubIds(instCurrClassSecId) {
        return teacherSubjects.findAll({
            attributes: ['CURSUBID'],
            where: {'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getSubjectIds(currSubId) {
        return curriculamSubjects.findAll({
            attributes: ['SUBJECTID'],
            where: {'CURRSUBID': currSubId}
        });
    }

    static getAllSubjects(id) {
        return subjectMaster.findAll({
            attributes: ['SUBJECTID', 'SUBJECT'],
            where: {'SUBJECTID': id}
        });
    } */

    /* Call to get Subjects ------> End */

    static getLessonDetails(classId, currSubId) {
        return curriculamSubLessions.findAll({
            attributes: ['LESSIONID','CURSUBCLASSLESID','LESSIONNAME'],
            where: {'CLASSID': classId, 'CURSUBID': currSubId}
        });
    }

    static getTeacherVideoStatus(teacherId, currSubClassLessId, instCurrClassSecId) {
        return teacherVideo.findAll({
            attributes: ['VIDEOSTATUS'],
            where: {'TEACHERID': teacherId, 'CURSUBCLASSSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId, 'VIDEOSTATUS': {
                [Op.ne]: 1
            }}
        });
    }

    static getTeacherAssignmentStatus(teacherId, currSubClassLessId, instCurrClassSecId) {
        return assignments.findAll({
            attributes: ['ASSIGNMENTSTATUS'],
            where: {'TEACHERID': teacherId, 'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId, 'ASSIGNMENTSTATUS': {
                [Op.ne]: 1
            }}
        });
    }

    static getStudentCountinSection(instCurrClassSecId, currSubId) {
        return sequelize.query(`select count(*) AS studentsCount from 
         studentsubjects where 
         INSTCURCLASSSECID = `+ instCurrClassSecId +` and CURSUBID = ` + currSubId, {
             type: Sequelize.QueryTypes.SELECT
         });
     }

    static getStudentCountinVideoStatus(currSubClassLessId, instCurrClassSecId) {
        return studentVideoStatus.count({
            where: {CURSUBCLASSLESID: currSubClassLessId, INSTCURCLASSSECID: instCurrClassSecId}
        });
     }

    static getStudentVideoStatus(currSubClassLessId, instCurrClassSecId) {
        return studentVideoStatus.findOne({
            attributes: ['LISTENINGSTATUS'],
            where: {'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getStudentAssignmentStatus(currSubClassLessId, instCurrClassSecId) {
        return studentleswiseassignmentstatus.findOne({
            attributes: ['ASSIGNMENTSTATUS'],
            where: {'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getStudentCountinAssignmentStatus(currSubClassLessId, instCurrClassSecId) {
        return studentleswiseassignmentstatus.count({
            where: {CURSUBCLASSLESID: currSubClassLessId, INSTCURCLASSSECID: instCurrClassSecId}
        });
     }

    /* Call to save or update video details ------> Start */
    static getMaxVideoSeqNo(instId, currSubClassLessId) {
        // console.log('instId', instId, ' curr Sub Class LessId', currSubClassLessId);
        return teacherVideo.findOne({
            attributes: [
                [Sequelize.fn('max', Sequelize.col('VIDEOSEQNO')), 'MAXVIDEOSEQNO'],
            ],
            where: {'INSTID': instId, 'CURSUBCLASSSLESID': currSubClassLessId}
        })
    }
    
    static saveVideoDetails(videoDetails, videoSeqNo, videoId, videoPath) {
        let teacherVideoObj = {};
        const modifyFlag = videoDetails.modifyFlag;

        teacherVideoObj.INSTID = videoDetails.instId;
        teacherVideoObj.TEACHERID = videoDetails.teacherId;
        teacherVideoObj.CURRID = videoDetails.currId;
        teacherVideoObj.CLASSID = videoDetails.classId;
        teacherVideoObj.INSTCURCLASSID = videoDetails.instCurrClassId;
        teacherVideoObj.CURSUBID = videoDetails.currSubId;
        teacherVideoObj.CURSUBCLASSSLESID = videoDetails.currSubClassLessId;
        teacherVideoObj.INSTCURCLASSSECID = videoDetails.instCurrClassSecId;
        teacherVideoObj.TEACHERREMARKS = videoDetails.teacherRemarks;
        teacherVideoObj.VIDEOSTATUS = videoDetails.videoStatus;
        teacherVideoObj.VIDEOSEQNO = videoSeqNo;
        teacherVideoObj.VIDEOID = videoId;
        teacherVideoObj.VIDEOAUDIOPATH = videoPath;
        teacherVideoObj.VIDEOAUDIONAME = videoDetails.videoAudioName;
        teacherVideoObj.LESSIONSLNO = 1;

        if (modifyFlag === 'false') {
            return teacherVideo.create(teacherVideoObj);
        } else {
            return teacherVideo.update(teacherVideoObj, {
                where: {'id': videoDetails.id}
            })
        }
    }
    /* Call to save or update video details ------> End */

    static updateVideoDetails(id, videoStatus, teacherRemarks) {
        return teacherVideo.update({
            VIDEOSTATUS: videoStatus, TEACHERREMARKS: teacherRemarks
        },{
            where: {'id': id}
        });
    }

    static updateVideoStatusinLessonLevel(currSubClassLessId, instCurrClassSecId) {
        return studentVideoStatus.update({
            LISTENINGSTATUS: 3
        },{
            where: {'CURSUBCLASSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static deleteVideoDetails(id) {
        return teacherVideo.destroy({
            where: {'id': id}
        })
    }


    static getAllVideoDetails(teacherId, currSubClassLessId, instCurrClassSecId) {

        return teacherVideo.findAll({
            where: {'TEACHERID': teacherId, 'CURSUBCLASSSLESID': currSubClassLessId, 'INSTCURCLASSSECID': instCurrClassSecId}
        });
    }

    static getVideoDetailsByTeacherID(curSubClassLessId) {

        return teacherVideo.findAll({
            attributes: ['TEACHERID','VIDEOID','VIDEOAUDIOPATH','VIDEOSTATUS'],
            where: {'CURSUBCLASSLESID': curSubClassLessId}
        });
    }

    static getstudentsmobilenos(cussubid, sectionid){      
      return sequelize.query(`select  s.MOBILENO
      from studentmasters s 
      inner join studentsubjects ss on s.STUDENTID = ss.STUDENTID              
      where ss.INSTCURCLASSSECID = ` + sectionid + ` and ss.CURSUBID = ` + cussubid, {
          type: Sequelize.QueryTypes.SELECT
      }); 
    }

    static getdataforsms(id){
         return sequelize.query(`select  t.CURSUBID, t.INSTCURCLASSSECID, cs.LESSIONNAME, sm.SUBJECTNAME
		from teachervideos t 
		inner join curriculumsublessions cs on cs.CURSUBID = t.CURSUBID and cs.CURSUBCLASSLESID = t.CURSUBCLASSSLESID
        inner join subjectmasters sm on  sm.SUBJECTID = cs.SUBJECTID
		where t.id=` + id, {
            type: Sequelize.QueryTypes.SELECT
        }); 

    }
}

