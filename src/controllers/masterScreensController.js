const masterDAO = require('../DAO/masterScreensDAO');
const teacherSubjects = require('../models/teacherSubjects');
const bcrypt = require('bcrypt');

exports.getAllInstituteTypes = async (req, res, next) => {
    masterDAO.getAllInstituteTypes()
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadInstitutesByInstituteType = async (req, res, next) => {
    const instituteTypeId = req.body.INSTTYPEID;
    masterDAO.loadInstitutesByInstituteType(instituteTypeId)
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadTeachersByInstitute = async (req, res, next) => {
    const instituteId = req.body.INSTID;
    masterDAO.loadTeachersByInstitute(instituteId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadCurriculumByInstitute = async (req, res, next) => {
    const instituteId = req.body.INSTID;
    masterDAO.loadCurriculumByInstitute(instituteId)
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadClassesByCurriculumAndInstitute = async (req, res, next) => {
    const instCurrId = req.body.INSTCURID;
    masterDAO.loadClassesByCurriculumAndInstitute(instCurrId)
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadSectionByClassesAndCurriculumAndInstitute = async (req, res, next) => {
    const instCurrClassId = req.body.INSTCURCLASSID;
    masterDAO.loadSectionByClassesAndCurriculumAndInstitute(instCurrClassId)
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.loadSubjectsByCurriculum = async (req, res, next) => {
    const currId = req.body.CURRID;
    masterDAO.loadSubjectsByCurriculum(currId)
    .then((currData) => {
        res.status(200).json(currData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.saveTeacherSubjects = async (req, res, next) => {
    const teacherSubjectObj = req.body;
    let subjectsArray = teacherSubjectObj.CURSUBID;
    let teacherSubjectArray = [];
    subjectsArray.forEach((element) => {
        let obj = {};
        obj.CURRID = teacherSubjectObj.CURRID;
        obj.TEACHERID = teacherSubjectObj.TEACHERID,
        obj.INSTCURID = teacherSubjectObj.INSTCURID,
        obj.INSTCURCLASSID = teacherSubjectObj.INSTCURCLASSID,
        obj.INSTCURCLASSSECID = teacherSubjectObj.INSTCURCLASSSECID,
        obj.CURSUBID = element,
        obj.CLASSID = teacherSubjectObj.CLASSID,
        obj.SECTIONID = teacherSubjectObj.SECTIONID,

        teacherSubjectArray.push(obj);
    });
    console.log(teacherSubjectArray);
    teacherSubjects.bulkCreate(teacherSubjectArray)
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

exports.saveTeacherMaster = async (req, res, next) => {
    let teacherMasterObj = req.body;
    const instId = teacherMasterObj.instId;
    let teacherSequenceNo;
    let teacherId;
    masterDAO.getMaxTeacherSequenceNo(instId)
    .then(result => {
        if (result.dataValues.MAXTEACHERSEQ === null) {
            teacherSequenceNo = 1;
        } else {
            teacherSequenceNo = result.dataValues.MAXTEACHERSEQ;
        }
        teacherMasterObj.teacherSequenceNo = teacherSequenceNo;

        teacherId = instId + getSequenceNumber(teacherSequenceNo);
        teacherMasterObj.teacherId = teacherId;

        if (teacherMasterObj.isPrincipal === false) {
            teacherMasterObj.isPrincipal = 0;
        } else {
            teacherMasterObj.isPrincipal = 1;
        }
        return masterDAO.saveTeaccherMaster(teacherMasterObj);
    })
    .then((response) => {
        if (response) {
            const password = '123456';
            return bcrypt.hash(password, 12);
        }
    })
    .then((hashedPassword) => {
        const loginObj = {
            loginid: teacherMasterObj.mobileNo,
            password: hashedPassword,
            username: teacherMasterObj.firstName + ' ' + teacherMasterObj.lastName,
            isfirsttimelogin: 1,
            mobileno: teacherMasterObj.mobileNo,
            email: teacherMasterObj.emailId,
            mpin: '0',
            uuid: 'NA',
            accesslevelid: '1',
            institutionid: teacherMasterObj.instId,
            groupid: '2',
            updatedby: 'NA',
            modifyFlag: teacherMasterObj.modifyFlag
        };
        return masterDAO.saveLoginMaster(loginObj);
    })
    .then((response) => {
        if (response) {
            res.status(200).json(response);
        }
    })
    .catch(err => {
        next(err);
    })
    .catch(err => {
        next(err);
    })
    .catch(err => {
        next(err);
    })
    .catch(err => {
        next(err);
    })
}

exports.loadTeacherDataToModify = async (req, res, next) => {
    
    const instituteId = req.body.INSTID;
    const teacherId = req.body.TEACHERID;
    masterDAO.loadTeacherDataToModify(instituteId,teacherId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })
    .catch(err => {
        return next(err);
    })
}

function getSequenceNumber(id) {
    let maxId;
    if (id < 10) {
        maxId = '00' + id;
    } else if (id < 100) {
        maxId = '0' + id;
    } else {
        maxId = id;
    }
    return maxId;
}