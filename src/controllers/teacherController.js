const TeacherDAO = require('../DAO/teacherDAO');
const StudentDAO = require('../DAO/studentDAO');

exports.getAllTeacherDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    TeacherDAO.getAllTeacherDetails(teacherId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })
    .catch(err => {
        return next(err);
    })
}

exports.getCurriculumDetails = async (req, res, next) => { 
    const mobileno = req.body.mobileno;

    TeacherDAO.getTeacherId(mobileno)
    .then((result) => {
        const teacherId = result.TEACHERID;
        return TeacherDAO.getCurriculumDetails(teacherId);
    })
    .then((curriculumData) => {
        res.status(200).json(curriculumData);
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);;
    })
}

exports.getClassDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrId = req.body.instCurrId;

    TeacherDAO.getClasses(teacherId, instCurrId)
    .then((classData) => {
        res.status(200).json(classData);
    })
    .catch(err => {
        return next(err);
    })  
}

exports.getSectionDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassId = req.body.instCurrClassId;

    TeacherDAO.getSectionDetails(teacherId, instCurrClassId)
    .then((sectionData) => {
        res.status(200).json(sectionData);
    }).catch(err => {
        return next(err);
    })  
}

exports.getActivityDetails = async (req, res, next) => { 
    const accesslevelid = req.body.accesslevelid;
    const groupid = req.body.groupid;
    TeacherDAO.getActivityDetails(accesslevelid, groupid)
    .then((activityData) => {
        res.status(200).json(activityData);
    }).catch(err => {
        return next(err);
    })  
}

exports.getTeacherSubjectDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    let subjectsArray = [];
    let lessonsCount = [];
    /* Method 1 */
    TeacherDAO.getTeacherSubjectDetails(teacherId, instCurrClassSecId)
    .then((subjectDetails) => {
        subjectDetails.forEach(element => {
            subjectsArray.push(element);
            const subjectId = element.SUBJECTID;
            lessonsCount.push(TeacherDAO.getCountForLessons(subjectId));
        })
        return Promise.all(lessonsCount);
    })
    .then((result) => {
        console.log(result);
        for (let i = 0; i < subjectsArray.length; i++) {
            subjectsArray[i].lessonCount = result[i];
        }
        res.status(200).json(subjectsArray);
    })
    .catch(err => {
        return next(err);
    })

    /* Method 2 */
    /* const currSubIdData = [];
    const subjectData = [];
    const finalArray = [];
    TeacherDAO.getCurrSubIds(instCurrClassSecId)
    .then(currSubIds => {
        currSubIds.forEach(element => {
            const curSubId = element.dataValues.CURSUBID;
            currSubIdData.push(TeacherDAO.getSubjectIds(curSubId));
        });
        return Promise.all(currSubIdData);
    })
    .then((result) => {
        for (let i = 0; i < result.length; i++) {
            const subjectObj = result[i][0].dataValues;
            const subjectId = subjectObj.SUBJECTID;
            subjectData.push(TeacherDAO.getAllSubjects(subjectId));
        }
        return Promise.all(subjectData);
    })
    .then((result) => {
        for (let i = 0; i < result.length; i++) {
            finalArray.push(result[i][0].dataValues)
        }
        res.status(200).json(finalArray);
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    }) */

}

exports.getLessonDetails = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const lessonsData = [];

    TeacherDAO.getLessonDetails(classId, currSubId)
    .then((lessonData) => {
        res.status(200).json(lessonData);
    })
    .catch(err => {
        return next(err);
    })

}

exports.getLessonDetailsWithVideoStatus = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    let studentsCount;
    const lessonsData = [];
    const teacherVideoStatus = [];
    const studentListeningStatus = [];
    let studentListeningStatusCount = [];
    
    TeacherDAO.getLessonDetails(classId, currSubId)
    .then((lessonData) => {
        if (lessonData.length > 0) {
            lessonData.forEach(element => {
                lessonsData.push(element.dataValues);
            });
            lessonsData.forEach(element => {
                const currSubClassLessId = element.CURSUBCLASSLESID;
                teacherVideoStatus.push(TeacherDAO.getTeacherVideoStatus(teacherId, currSubClassLessId, instCurrClassSecId));
            });
            Promise.all(teacherVideoStatus)
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].length > 0) {
                        lessonsData[i].teacherVideo = true;
                    } else {
                        lessonsData[i].teacherVideo = false;
                    }
                }
                for (let i = 0; i < lessonsData.length; i++) {
                    if (lessonsData[i].teacherVideo === true) {
                        const currSubClassLessId = lessonsData[i].CURSUBCLASSLESID;
                        studentListeningStatus.push(TeacherDAO.getStudentVideoStatus(currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentListeningStatus.push(null);
                    }
                }
                return Promise.all(studentListeningStatus);
            })
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i]) {
                        lessonsData[i].videoStatus = result[i].dataValues.LISTENINGSTATUS;
                    } else {
                        if (lessonsData[i].teacherVideo === false) {
                            lessonsData[i].videoStatus = 1;
                        } else {
                            lessonsData[i].videoStatus = 2;
                        }
                    }
                }
                for (let i = 0; i < lessonsData.length; i++) {
                    if (lessonsData[i].videoStatus === 4) {
                        const currSubClassLessId = lessonsData[i].CURSUBCLASSLESID;
                        studentListeningStatusCount.push(TeacherDAO.getStudentCountinVideoStatus(currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentListeningStatusCount.push(null);
                    }
                }
                return Promise.all(studentListeningStatusCount);
            })
            .then((result) => {
                studentListeningStatusCount = result;
                return TeacherDAO.getStudentCountinSection(instCurrClassSecId, currSubId);
            })
            .then((result) => {
                studentsCount = result[0].studentsCount;
                for (let i = 0; i < studentListeningStatusCount.length; i++) {
                    // console.log(studentListeningStatusCount[i], ' ', studentsCount);
                    if (studentListeningStatusCount[i] !== null) {
                        if (studentListeningStatusCount[i] === studentsCount) {
                            lessonsData[i].videoStatus = 4;
                        } else {
                            lessonsData[i].videoStatus = 3;
                        }
                    }
                }
                res.status(200).json(lessonsData);
            })
            .catch(err => {
                return res.next(err);
            })
            .catch(err => {
                return next(err);
            })
            .catch(err => {
                return next(err);
            })
            .catch(err => {
                return next(err);
            })
        } else {
            res.status(200).json(lessonData);
        }
    })
    .catch(err => {
        return next(err);
    })
}

exports.getLessonDetailsWithAssignmentStatus = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    let studentsCount;
    const lessonsData = [];
    const teacherAssignmentStatus = [];
    const studentListeningStatus = [];
    let studentListeningStatusCount = [];
    
    TeacherDAO.getLessonDetails(classId, currSubId)
    .then((lessonData) => {
        if (lessonData.length > 0) {
            lessonData.forEach(element => {
                lessonsData.push(element.dataValues);
            });
            lessonsData.forEach(element => {
                const currSubClassLessId = element.CURSUBCLASSLESID;
                teacherAssignmentStatus.push(TeacherDAO.getTeacherAssignmentStatus(teacherId, currSubClassLessId, instCurrClassSecId));
            });
            Promise.all(teacherAssignmentStatus)
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].length > 0) {
                        lessonsData[i].teacherVideo = true;
                    } else {
                        lessonsData[i].teacherVideo = false;
                    }
                }
                for (let i = 0; i < lessonsData.length; i++) {
                    if (lessonsData[i].teacherVideo === true) {
                        const currSubClassLessId = lessonsData[i].CURSUBCLASSLESID;
                        studentListeningStatus.push(TeacherDAO.getStudentAssignmentStatus(currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentListeningStatus.push(null);
                    }
                }
                return Promise.all(studentListeningStatus);
            })
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i]) {
                        lessonsData[i].videoStatus = result[i].dataValues.ASSIGNMENTSTATUS;
                    } else {
                        if (lessonsData[i].teacherVideo === false) {
                            lessonsData[i].videoStatus = 1;
                        } else {
                            lessonsData[i].videoStatus = 2;
                        }
                    }
                }
                for (let i = 0; i < lessonsData.length; i++) {
                    if (lessonsData[i].videoStatus === 4) {
                        const currSubClassLessId = lessonsData[i].CURSUBCLASSLESID;
                        studentListeningStatusCount.push(TeacherDAO.getStudentCountinVideoStatus(currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentListeningStatusCount.push(null);
                    }
                }
                return Promise.all(studentListeningStatusCount);
            })
            .then((result) => {
                studentListeningStatusCount = result;
                return TeacherDAO.getStudentCountinSection(instCurrClassSecId, currSubId);
            })
            .then((result) => {
                studentsCount = result[0].studentsCount;
                for (let i = 0; i < studentListeningStatusCount.length; i++) {
                    if (studentListeningStatusCount[i] !== null) {
                        if (studentListeningStatusCount[i] === studentsCount) {
                            lessonsData[i].videoStatus = 4;
                        } else {
                            lessonsData[i].videoStatus = 3;
                        }
                    }
                }
                res.status(200).json(lessonsData);
            })
            .catch(err => {
                return res.next(err);
            })
            .catch(err => {
                return next(err);
            })
            .catch(err => {
                return next(err);
            })
            .catch(err => {
                return next(err);
            })
        } else {
            res.status(200).json(lessonData);
        }
    })
    .catch(err => {
        return next(err);
    })
}

exports.getTeacherVideoStatus = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const currSubClassLessId = req.body.currSubClassLessId;

    TeacherDAO.getTeacherVideoStatus(teacherId, currSubClassLessId, instCurrClassSecId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
}