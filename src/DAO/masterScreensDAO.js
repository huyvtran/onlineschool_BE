const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const teacherMaster = require('../models/teacherMaster');
const login = require('../models/loginModel');

module.exports = class masterScreensDAO {

    static getAllInstituteTypes() {
        return sequelize.query(`select INSTTYPEID,INSTITUTETYPE,INSTITUTESEQID,STATUS
        from institutetypemasters`, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }
    
    static loadInstitutesByInstituteType(instituteTypeId) {
        return sequelize.query(`select INSTID,INSTITUTIOINNAME
        from institutionmasters where INSTTYPEID=`+instituteTypeId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }    

    static loadCurriculumByInstitute(instituteId) {
        return sequelize.query(`select a.CURRID,a.INSTCURID,b.CURRICULUMNAME
        from institutecurriculums a 
        inner join curriculummasters b        
        on a.CURRID = b.CURRID         
          where a.INSTID = `+instituteId, {
            type: Sequelize.QueryTypes.SELECT
        });
    }

    static loadClassesByCurriculumAndInstitute(instCurrId) {
        return sequelize.query(`select distinct a.CLASSID,a.INSTCURCLASSID,b.CLASSNAME
        from instituteclasses a
        inner join classmasters b
        on a.CLASSID = b.CLASSID
          where a.INSTCURID  = `+instCurrId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static loadSectionByClassesAndCurriculumAndInstitute(instCurrClassId) {
        return sequelize.query(`select a.SECTIONID,a.INSTCURCLASSSECID,b.SECTIONNAME
        from instituteclasses a 
        inner join sectionmasters b        
        on a.SECTIONID = b.SECTIONID         
          where a.INSTCURCLASSID =`+instCurrClassId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static loadSubjectsByCurriculum(currId) {
        return sequelize.query(`select a.SUBJECTID,a.CURSUBID,b.SUBJECTNAME
        from curriculumsubjects a 
        inner join subjectmasters b        
        on a.SUBJECTID = b.SUBJECTID    
          where a.CURRID =`+currId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static loadTeachersByInstitute(instituteId) {
        return sequelize.query(`select TEACHERID, concat(FIRSTNAME,' ',LASTNAME) as TEACHERNAME
        from teachermasters  
         where INSTID =`+instituteId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }


    static loadTeacherDataToModify(instituteId,teacherId) {
        return sequelize.query(`select * from teachermasters    
          where a.CURRID =`+instituteId+`and TEACHERID =`+teacherId, {
            type: Sequelize.QueryTypes.SELECT
        }); 
    }

    static getMaxTeacherSequenceNo(instId) {
        return teacherMaster.findOne({
            attributes: [
                [Sequelize.fn('max', Sequelize.col('TEACHERSEQ')), 'MAXTEACHERSEQ'],
            ],
            where: {'INSTID': instId}
        })
    }

    static saveTeaccherMaster(teacherMasterObj) {
        const teacherObj = {
            INSTID: teacherMasterObj.instId,
            TEACHERID: teacherMasterObj.teacherId,
            TEACHERSEQ: teacherMasterObj.teacherSequenceNo,
            SALUTATION: teacherMasterObj.salutation,
            FIRSTNAME: teacherMasterObj.firstName,
            LASTNAME: teacherMasterObj.lastName,
            GENDER: teacherMasterObj.gender,
            DESIGNATION: teacherMasterObj.designation,
            MOBILENO: teacherMasterObj.mobileNo,
            EMAILID: teacherMasterObj.emailId,
            IS_PRINCIPAL: teacherMasterObj.isPrincipal,
        };
        console.log(teacherObj);
        if (teacherMasterObj.modifyFlag === false) {
            return teacherMaster.create(teacherObj);
        } else {
            return teacherMaster.update(teacherObj, {
                where: {id: teacherObj.id}
            });
        }
    }

    static saveLoginMaster(loginObj) {
        if (loginObj.modifyFlag === false) {
            return login.create(loginObj);
        } else {
            return login.update(loginObj, {
                where: {mobileno: loginObj.mobileno}
            });
        }
    }
}