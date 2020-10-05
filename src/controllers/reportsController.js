
const ReportsDAO = require('../DAO/reportsDAO');
exports.getUplodedLessionsByTeacher = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const currSubClassLessId = req.body.currSubClassLessId;
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllTeacherLessionDetails(teacherId, instCurrClassSecId, currSubClassLessId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
    /* ReportsDAO.getAllTeacherLessionDetails(teacherId, instCurClassSecId, currSubClassLessId)
    .then((teacherData) => {
        teacherData.forEach(element => {
            subjectsArray.push(element);
            const currSubClassLessId = element.CURSUBCLASSSLESID;
            lessionArray.push(ReportsDAO.getLessionNames(currSubClassLessId));
        })
        return Promise.all(lessionArray);
    })
    .then((result)=> {
        for(let i = 0; i < result.length; i++) {
            subjectsArray[i].LessionName = result[i].dataValues.LESSIONNAME;
        }
        res.status(200).json(subjectsArray);
    })
    .catch(err => {
        return next(err);
    }) */
}

exports.getAllTeacherDoubtClarifficationDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const currSubClassLessId = req.body.currSubClassLessId;
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllTeacherDoubtClarifficationDetails(teacherId, instCurrClassSecId, currSubClassLessId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
    /* ReportsDAO.getAllTeacherDoubtClarifficationDetails(teacherId, instCurrClassSecId, currSubClassLessId)
    .then((teacherData) => {
        teacherData.forEach(element => {
            subjectsArray.push(element);
            const currSubClassLessId = element.CURSUBCLASSLESID;
            lessionArray.push(ReportsDAO.getLessionNames(currSubClassLessId));
        })
        return Promise.all(lessionArray);
    })
    .then((result)=> {
        for(let i = 0; i < result.length; i++) {
            subjectsArray[i].LessionName = result[i].dataValues.LESSIONNAME;
        }
        res.status(200).json(subjectsArray);
    })
    .catch(err => {
        return next(err);
    }) */
}

exports.getAllTeacherAssignmentDetails = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const currSubClassLessId = req.body.currSubClassLessId;
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllTeacherAssignmentDetails(teacherId, instCurrClassSecId, currSubClassLessId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })
    /* ReportsDAO.getAllTeacherAssignmentDetails(teacherId)
    .then((teacherData) => {
        teacherData.forEach(element => {
            subjectsArray.push(element);
            const currSubClassLessId = element.CURSUBCLASSLESID;
            lessionArray.push(ReportsDAO.getLessionNames(currSubClassLessId));
        })
        return Promise.all(lessionArray);
    })
    .then((result)=> {
        for(let i = 0; i < result.length; i++) {
            subjectsArray[i].LessionName = result[i].dataValues.LESSIONNAME;
        }
        res.status(200).json(subjectsArray);
    })
    .catch(err => {
        return next(err);
    }) */
}

exports.getAllTeacherSubjectsByStudent = async (req, res, next) => {
    const teacherId = req.body.teacherId;
    const currId = req.body.currId;
    const sectionId = req.body.sectionId;
    const classId = req.body.classId;
   // console.log('Controller--'+teacherId);
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllTeacherSubjectsByStudent(teacherId,currId,classId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })

    .catch(err => {
        return next(err);
    })
}

exports.getAllChapters = async (req, res, next) => {
    const currId = req.body.currId;
    const subjectId = req.body.subjectId;
    const classId = req.body.classId;
   
   // console.log('Controller--'+teacherId);
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllChapters(currId,subjectId,classId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })

    .catch(err => {
        return next(err);
    })

}

exports.getAllAssignmentsByTeacher = async (req, res, next) => {
   // const currId = req.body.currId;
  //  const subjectId = req.body.subjectId;
 //   const classId = req.body.classId;
 const teacherId = req.body.teacherId;
 const curSubClassLesId=req.body.curSubClassLesId;
   // console.log('Controller--'+teacherId);
    let subjectsArray = [];
    let lessionArray = [];
    ReportsDAO.getAllAssignmentsByTeacher(teacherId,curSubClassLesId)
    .then((teacherData) => {
        res.status(200).json(teacherData);
    })

    .catch(err => {
        return next(err);
    })
    
}

exports.getAllAssignmentsByTeacherStudent = async (req, res, next) => {
    // const currId = req.body.currId;
   //  const subjectId = req.body.subjectId;
  //   const classId = req.body.classId;
  const instCurClassSecId = req.body.instCurClassSecId;
    // console.log('Controller--'+teacherId);
     let subjectsArray = [];
     let lessionArray = [];
     ReportsDAO.getAllAssignmentsByStudents(instCurClassSecId)
     .then((teacherData) => {
         res.status(200).json(teacherData);
     })
 
     .catch(err => {
         return next(err);
     })
     
 }

 exports.getAllAssignmentStatusByStudent = async (req, res, next) => {
    const teacherId = req.body.teacherId;
   // console.log('Controller--'+teacherId);
    let subjectsArray = [];
    let lessionArray = [];
    let studentArray =[];
    let resultArray = [];
    ReportsDAO.getAssignmentStatusFromAssignments(teacherId)
    .then((teacherData) => {
        teacherData.forEach(element => {
           // console.log(element);
            subjectsArray.push(element);
            const instCurClassSecId = element.INSTCURCLASSSECID;
          //  console.log('currSubClassLessId--'+currSubClassLessId)
            lessionArray.push(ReportsDAO.getAllAssignmentsByStudents(instCurClassSecId));
        })
        return Promise.all(lessionArray);
    })
    .then((result)=> {
        for(let i = 0; i < result.length; i++) {
            studentArray.push(result[i]);
           
        }
        // console.log(subjectsArray);

            //studentArray.push(result[i]);
            for(let j=0;j<studentArray[0].length;j++)
            {

                studentArray[0][j].INSTCURCLASSSECID=subjectsArray[0].INSTCURCLASSSECID;
                studentArray[0][j].ASSIGNMENTSTATUS=subjectsArray[0].ASSIGNMENTSTATUS;
                console.log('j=='+studentArray[0].length+'=='+studentArray[j]);
            }
        res.status(200).json(studentArray);
    })
    .catch(err => {
        return next(err);
    })
}


exports.getAllStudentStatusForListeningReadingAssignments = async (req, res, next) => {
    // const currId = req.body.currId;
     const assignmentId = req.body.assignmentId;
     const curSubClassLesId = req.body.curSubClassLesId;
  const instCurClassSecId = req.body.instCurClassSecId;
      let statusArray = [];
     ReportsDAO.getAllAssignmentsByStudents(instCurClassSecId)
     .then((teacherData) => {
        teacherData.forEach(element => {
             const studentId = element.STUDENTID;
             statusArray.push(ReportsDAO.getAllStatusesByStudents(studentId,curSubClassLesId,assignmentId));
         }) 
         return Promise.all(statusArray);
     })
     .then((result)=> {
        res.status(200).json(result);
        
    })
    .catch(err => {
        return next(err);
    })
     
 }

 exports.getAllStudentActivityStatus = async (req, res, next) => {
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const currSubClassLessId = req.body.currSubClassLessId;
    const currSubId = req.body.currSubId;

    ReportsDAO.getStudentStatus(instCurrClassSecId, currSubClassLessId, currSubId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        return next(err);
    })



    /* ReportsDAO.getStudentsList(instCurrClassSecId, currSubId)
    .then((result) => {
        console.log('result length ====> ', result.length);
        result.forEach((element) => {
            const studentId = element.dataValues.STUDENTID;
            listeningStatus.push(ReportsDAO.getStudentVideoStatus(studentId));
        });
        Promise.all(listeningStatus)
        .then((result) => {
            const listeningStatusObj = {};
            result.forEach((element) => {
                if (element) {
                    listeningStatusObj.listeningStatus = element.dataValues.LISTENINGSTATUS;
                } else {
                    listeningStatusObj.listeningStatus = 1;
                }
                studentArray.push(listeningStatusObj);
            });
            console.log(studentArray);
        })
        .catch(err => {
            return next(err);
        })
    })
    .catch(err => {
        return next(err);
    }) */
 }