const StudentDAO = require('../DAO/studentDAO');
const activities = require('../models/activityMaster');
const alActivities = require('../models/alActivities');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types')

exports.getAllStudentDetails = async (req, res, next) => {
    const studentId = req.body.studentId;
    StudentDAO.getAllStudentDetails(studentId)
    .then((studentData) => {
        res.status(200).json(studentData)
    })
    .catch(err => {
        return next(err);
    })
}

exports.getFiles = async (req, res, next) => {
    const files_ = [];
    myObj = new Object();
    var files = fs.readdirSync('E:/Download');
    for (var i in files){
        var name = 'E:/Download' + '/' + files[i];
        console.log(name)
        if (fs.statSync(name).isDirectory()){
           // getFiles(name, files_);
        } else {
            files_.push(name);
           // myObj[files[i]].push(name);
        }
    }
    //return files_;
    console.log(files_);
    res.status(200).json(files);
}

exports.downloadPDF = async (req, res, next) => {

    var file = fs.createReadStream('E:\\Download\\Java_CV_RamaKrishna.pdf');
    var stat = fs.statSync('E:\\Download\\Java_CV_RamaKrishna.pdf');
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=quote.pdf');
    file.pipe(res);
    //res.status(200).json(files);
}

exports.getStudentSubjectDetails = async (req, res, next) => {
    const studentId = req.body.studentId;
    let subjectsArray = [];
    let lessonsCount = [];
    StudentDAO.getStudentSubjectDetails(studentId)
    .then((subjectsData) => {
        subjectsData.forEach(element => {
            subjectsArray.push(element);
            const subjectId = element.SUBJECTID;
            lessonsCount.push(StudentDAO.getCountForLessons(subjectId));
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
}

exports.getStudentLessonDetailsWithListeningStatus = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const studentId = req.body.studentId;
    let lessonsData = [];
    let teacherVideoStatus = [];
    let studentVideoStatus = [];
    
    StudentDAO.getStudentLessonDetails(classId, currSubId)
    .then((lessonData) => {
        if (lessonData.length > 0) {
            lessonData.forEach(element => {
                lessonsData.push(element.dataValues);
            });
            lessonsData.forEach(element => {
                const currSubClassLessId = element.CURSUBCLASSLESID;
                teacherVideoStatus.push(StudentDAO.getTeacherVideoStatus(currSubClassLessId, instCurrClassSecId));
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
                        studentVideoStatus.push(StudentDAO.getStudentVideoStatus(studentId, currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentVideoStatus.push(null);
                    }
                }
                return Promise.all(studentVideoStatus);
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
                res.status(200).json(lessonsData);
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

exports.getStudentLessonDetailsWithAssignmentStatus = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const studentId = req.body.studentId;
    let lessonsData = [];
    let teacherAssignmentStatus = [];
    let studentAssignmentStatus = [];
    
    StudentDAO.getStudentLessonDetails(classId, currSubId)
    .then((lessonData) => {
        if (lessonData.length > 0) {
            lessonData.forEach(element => {
                lessonsData.push(element.dataValues);
            });
            lessonsData.forEach(element => {
                const currSubClassLessId = element.CURSUBCLASSLESID;
                teacherAssignmentStatus.push(StudentDAO.getTeacherAssignmentStatus(currSubClassLessId, instCurrClassSecId));
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
                        studentAssignmentStatus.push(StudentDAO.getStudentAssignmentStatus(studentId, currSubClassLessId, instCurrClassSecId));
                    } else {
                        studentAssignmentStatus.push(null);
                    }
                }
                return Promise.all(studentAssignmentStatus);
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
                res.status(200).json(lessonsData);
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

exports.getStudentLessonDetailsWithReadingStatus = async (req, res, next) => {
    const classId = req.body.classId;
    const currSubId = req.body.currSubId;
    const studentId = req.body.studentId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    let lessonsData = [];
    let studentReadingStatus = [];

    StudentDAO.getStudentLessonDetails(classId, currSubId)
    .then((lessonData) => {
        if (lessonData.length > 0) {
            lessonData.forEach(element => {
                lessonsData.push(element.dataValues);
            });
            lessonsData.forEach(element => {
                const currSubClassLessId = element.CURSUBCLASSLESID;
                studentReadingStatus.push(StudentDAO.getStudentReadingStatus(studentId, currSubClassLessId, instCurrClassSecId));
            });
            Promise.all(studentReadingStatus)
            .then((result) => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i]) {
                        lessonsData[i].videoStatus = result[i].dataValues.LESSIONSTATUS;
                    } else {
                        lessonsData[i].videoStatus = 2;
                    }
                }
                res.status(200).json(lessonsData);
            })
            .catch(err => {
                return next(err);
            });
        } else {
            res.status(200).json(lessonData);
        }
    })
    .catch(err => {
        return next(err);
    })
}

exports.getVideoDetailsByLesson = async (req, res, next) => {
    const currSubClassLessId = req.body.currSubClassLessId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const studentId = req.body.studentId;
    StudentDAO.getVideoDetailsByLesson(currSubClassLessId, instCurrClassSecId, studentId)
    .then((videoDetails) => {
        res.status(200).json(videoDetails);
    })
    .catch(err => {
        return next(err);
    })
}

exports.saveStudentListenings = async (req, res, next) => {
    const studentObj = req.body;
    const videoId = studentObj.videoId;
    const studentId = studentObj.studentId;
    const instCurrClassSecId = studentObj.instCurrClassSecId;
    let listeningStatus = studentObj.listeningStatus;
    let responseObj;
    let totalVideosCountinLesson;
    let studentVideosCountinLesson;
    let completedListeningCount;
    let studentsCount;
    let listeningCount;
    
    StudentDAO.getStudentListeningRecord(studentId, videoId)
    .then((result) => {
        if (result) {
            return StudentDAO.updateStudentListenings(studentObj);
        } else {
            return StudentDAO.saveStudentListenings(studentObj);
        }
    })
    .then((response) => {
        if (response) {
            responseObj = response;
            if (listeningStatus === 3) {
                StudentDAO.getStudentLessonStatus(studentObj.studentId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId)
                .then((result) => {
                    if (result) {
                        return StudentDAO.updateStudentLessonVideoStatus(studentObj, 3);
                    } else {
                        return StudentDAO.saveStudentLessonVideoStatus(studentObj);
                    }
                })
                .then((result) => {
                    if (result) {
                        return StudentDAO.updateTeacherVideoStatus(listeningStatus, videoId, instCurrClassSecId);
                    }
                })
                .then((result) => {
                    if (result) {
                        res.status(200).json(responseObj);
                    }
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
            } else if (listeningStatus === 4) {
                StudentDAO.getStudentLessonStatus(studentObj.studentId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId)
                .then((result) => {
                    if (result) {
                        return StudentDAO.updateStudentLessonVideoStatus(studentObj, 4);
                    } else {
                        return StudentDAO.saveStudentLessonVideoStatus(studentObj, 4);
                    }
                })
                .then((result) => {
                    if (result) {
                        return StudentDAO.getVideosCountPerLessonForTeacher(studentObj.currSubClassLessId, studentObj.instCurrClassSecId);
                    }
                })
                .then((result) => {
                    totalVideosCountinLesson = result[0].totalVideosCountinLesson;
                    return StudentDAO.getVideosCountPerLessonForStudent(studentObj.studentId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId);
                })
                .then((result) => {
                    studentVideosCountinLesson = result[0].studentVideosCountinLesson;
                    if (totalVideosCountinLesson === studentVideosCountinLesson) {
                        StudentDAO.getCompletedStudentCountinListening(studentObj.studentId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId)
                        .then((result) => {
                            completedListeningCount = result[0].completedListeningCount;
                            if (completedListeningCount === 0) {
                                return StudentDAO.updateStudentLessonVideoStatus(studentObj, 4);
                            } else {
                                return StudentDAO.updateStudentLessonVideoStatus(studentObj, 3);
                            }
                        })
                        .then((result) => {
                            if (result) {
                                return StudentDAO.getStudentCountinSection(studentObj.instCurrClassSecId, studentObj.currSubId);
                            }
                        })
                        .then((result) => {
                            studentsCount = result[0].studentsCount;
                            return StudentDAO.getStudentCountinListening(videoId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId);
                        })
                        .then((result) => {
                            listeningCount = result[0].listeningCount;
                            if (listeningCount === studentsCount) {
                                listeningStatus = 4;
                            } else {
                                listeningStatus = 3;
                            }
                            return StudentDAO.updateTeacherVideoStatus(listeningStatus, videoId, instCurrClassSecId);
                        })
                        .then((result) => {
                            if (result) {
                                res.status(200).json(responseObj);
                            }
                        })
                        .catch(err => {
                            return next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                    } else {
                        return StudentDAO.updateStudentLessonVideoStatus(studentObj, 3)
                        .then((result) => {
                            if (result) {
                                return StudentDAO.getStudentCountinSection(studentObj.instCurrClassSecId, studentObj.currSubId);
                            }
                        })
                        .then((result) => {
                            studentsCount = result[0].studentsCount;
                            return StudentDAO.getStudentCountinListening(videoId, studentObj.currSubClassLessId, studentObj.instCurrClassSecId);
                        })
                        .then((result) => {
                            listeningCount = result[0].listeningCount;
                            if (listeningCount === studentsCount) {
                                listeningStatus = 4;
                            } else {
                                listeningStatus = 3;
                            }
                            return StudentDAO.updateTeacherVideoStatus(listeningStatus, videoId, instCurrClassSecId);
                        })
                        .then((result) => {
                            if (result) {
                                res.status(200).json(responseObj);
                            }
                        })
                        .catch(err => {
                            return next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                        .catch(err => {
                            return res.next(err);
                        })
                    }
                })
                .catch(err => {
                    return res.next(err);
                })
                .catch(err => {
                    return res.next(err);
                })
                .catch(err => {
                    return res.next(err);
                })
                .catch(err => {
                    return res.next(err);
                })
            }
        }
    })
    .catch(err => {
        return next(err);
    })
}

exports.getCurriculumNameById = async (req, res, next) => {
    const currId = req.body.currId;
    StudentDAO.getCurriculumNameById(currId)
    .then((curriculumName) => {
        res.status(200).json(curriculumName);
    })
    .catch(err => {
        return next(err);
    })
}

exports.getClassNameById = async (req, res, next) => {
    const classId = req.body.classId;
    StudentDAO.getClassNameById(classId)
    .then((className) => {
        res.status(200).json(className);
    })
    .catch(err => {
        return next(err);
    })
}

exports.downloadLessonPdf = async (req, res, next) => {
    const curriculumName = req.query.curriculumName;
    const className = req.query.className;
    const subjectName = req.query.subjectName;
    const lessonId = req.query.lessonId;
    const lessonName = req.query.lessonName;

    const filePath = StudentDAO.getPdfUrl(curriculumName, className, subjectName, lessonId, lessonName);
    console.log(filePath);
    fs.access(filePath, (error) => {
        if (!error) {
         const file = filePath;
         const filename = path.basename(file);
         const mimetype = mime.lookup(file);
         res.setHeader('Content-disposition', 'attachment; filename=' + filename);
         res.setHeader('Content-type', mimetype);
     
         const filestream = fs.createReadStream(file);
         filestream.pipe(res);
        } else {
            return next(error);
        }
    })
}

exports.readLessonPdf = async (req, res, next) => {
    const curriculumName = req.body.curriculumName;
    const className = req.body.className;
    const subjectName = req.body.subjectName;
    const lessonId = req.body.lessonId;
    const lessonName = req.body.lessonName;

    const url = StudentDAO.getPdfUrl(curriculumName, className, subjectName, lessonId, lessonName);
    fs.readFile(url, {encoding: 'base64'}, (err, data) => {
        if (err) {
            return next(err);
        } else {
            const obj = {
                base64String: data
            }
            res.status(200).json(obj);
        }
    })
    
	/* fs.writeFile(url, base64String, {encoding: 'base64'}, function(err) {
		if (err) {
            return next(err);
		} else {
			res.status(200).json({
                message: 'Lab report generated successfully',
                status: 200
            })
		}
	}); */
}

exports.saveStudentReadings = async (req, res, next) => {
    const studentId = req.body.studentId;
    const currSubId = req.body.currSubId;
    const currSubClassLessId = req.body.currSubClassLessId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const lessonStatus = req.body.lessonStatus;
    let studentDetailsObj = {}
    let studentReadingObj = {};

    StudentDAO.getAllStudentDetails(studentId)
    .then((result) => {
        studentDetailsObj = result.dataValues;
        return StudentDAO.getTeacherId(instCurrClassSecId, currSubId);
    })
    .then((result) => {
        const teacherId = result.dataValues.TEACHERID;
        studentReadingObj.INSTID = studentDetailsObj.INSTID;
        studentReadingObj.CURRID = studentDetailsObj.CURRID;
        studentReadingObj.INSTCURID = studentDetailsObj.INSTCURID;
        studentReadingObj.CLASSID = studentDetailsObj.CLASSID;
        studentReadingObj.INSTCURCLASSID = studentDetailsObj.INSTCURCLASSID;
        studentReadingObj.INSTCURCLASSSECID = studentDetailsObj.INSTCURCLASSSECID;
        studentReadingObj.CURSUBID = currSubId;
        studentReadingObj.CURSUBCLASSLESID = currSubClassLessId;
        studentReadingObj.TEACHERID = teacherId;
        studentReadingObj.LESSIONPATH = 'NA';
        studentReadingObj.LESSIONSTATUS = lessonStatus;
        studentReadingObj.STUDENTID = studentId;

        return StudentDAO.getStudentReadingRecord(studentId, currSubClassLessId, instCurrClassSecId);
    })
    .then((result) => {
        console.log(result);
        if (result) {
            return StudentDAO.updateStudentReadings(studentReadingObj);
        } else {
            return StudentDAO.saveStudentReadings(studentReadingObj);
        }
    })
    .then((result) => {
        res.status(200).json(result);
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
    .catch(err => {
        return next(err);
    })
}

exports.getStudentReadingRecord = async(req, res, next) => {
    const studentId = req.body.studentId;
    const currSubClassLessId = req.body.currSubClassLessId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    StudentDAO.getStudentReadingRecord(studentId, currSubClassLessId, instCurrClassSecId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
}

/* data posting calls dummy */
exports.saveActivities = async (req, res, next) => {
    const activitiesObj = req.body;
    activities.create(activitiesObj)
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
}

exports.saveAlActivities = async (req, res, next) => {
    const alActivitiesObj = req.body;
    alActivities.create(alActivitiesObj)
    .then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
}
