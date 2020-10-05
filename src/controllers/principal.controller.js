const logger = require('../util/logfile').log;
const pricipadao = require('../DAO/principalDao');
const { concat, select } = require('async');
const principalDao = require('../DAO/principalDao');
// const { getSubjectLessonsCount } = require('../DAO/principalDao');
//const { substring } = require('sequelize/types/lib/operators');


exports.getstudentoverview = (req,res,next) => {

    pricipadao.getstudentoverview(req.body.instid).then(result => {  
        let finalary = [];      
        result.forEach(ele => {      
             let ary = [];
             ary.push(ele.CLASSNAME);
             ary.push(ele.totalstudents);
             finalary.push(ary);
        })        
        res.status(200).json(finalary);
    })
    .catch(err => {
        logger.error(`principalcontroller::getstudentoverview :: err - ${err}`);        
        next(err);
    })    
} 

exports.getsubjectoverview = (req,res,next) => {
    pricipadao.getsubjectoverview(req.body.instid).then(result => {
        let finalary = [];      
        result.forEach(ele => {      
             let ary = [];
             ary.push(ele.SUBJECTNAME);
             ary.push(ele.teacher);             
             finalary.push(ary);
        }) 
        res.status(200).json(finalary);
    })
    .catch(err => {
         logger.error(`principalcontroller::getsubjectoverview :: err - ${err}`)
        next(err);
    })
}

// code changed by Jagan to bring curriculums
exports.getCurriculumByInstId = (req, res, next) => {
    const instId = req.body.instId;
    pricipadao.getCurriculumByInstId(instId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

// code changed by Jagan to bring Classes
exports.getClassesByInstCurId = (req, res, next) => {
    const instCurId = req.body.instCurId;
    pricipadao.getClassesByInstCurId(instCurId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

// code changed by Jagan to bring Sections
exports.getsectionsByInstCurClassId = (req, res, next) => {
    const instCurClassId = req.body.instCurClassId;
    pricipadao.getsectionsByInstCurClassId(instCurClassId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

// code changed by Jagan to bring Students
exports.getStudentsByInstCurClassSecId = (req, res, next) => {
    const instCurClassSecId = req.body.instCurClassSecId;
    principalDao.getStudentsByInstCurClassSecId(instCurClassSecId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

exports.getTeachersByInstId = (req, res, next) => {
    const instId = req.body.instId;
    principalDao.getTeachersByInstId(instId)
    .then((result) => {
        res.status(200).json(result);
    })
    .catch(err => {
        next(err);
    })
}

// code changed by Jagan to bring student graphical data
exports.getStudentGrapicalData = (req, res, next) => {
    const classId = req.body.classId;
    const instCurClassSecId = req.body.instCurClassSecId;
    const studentId = req.body.studentId;
    const selectionType = req.body.selectionType;
    let subjectsArray = [];
    let lessonsCount = [];
    let pendingStatusArray = [];
    let completedStatusArray = [];
    let finalArray = [];

    principalDao.getStudentSubjects(studentId, instCurClassSecId)
    .then((result) => {
        subjectsArray.push(...result);
        subjectsArray.forEach(element => {
            lessonsCount.push(principalDao.getSubjectLessonsCount(classId, element.CURSUBID));
        });
        return Promise.all(lessonsCount);
    })
    .then((result) => {
        Array.prototype.splice.apply(lessonsCount, [0, result.length].concat(result));
        if (selectionType === 0) {
            subjectsArray.forEach(element => {
                pendingStatusArray.push(principalDao.getStudentVideoStatus(studentId, element.CURSUBID, 3));
            });
            Promise.all(pendingStatusArray)
            .then((result) => {
                Array.prototype.splice.apply(pendingStatusArray, [0, result.length].concat(result));
                subjectsArray.forEach(element => {
                    completedStatusArray.push(principalDao.getStudentVideoStatus(studentId, element.CURSUBID, 4));
                });
                return Promise.all(completedStatusArray);
            })
            .then((result) => {
                Array.prototype.splice.apply(completedStatusArray, [0, result.length].concat(result));
                subjectsArray.forEach((element, i) => {
                    const elementArray = [];
                    elementArray.push(element.SUBJECTNAME);
                    elementArray.push(lessonsCount[i] - (pendingStatusArray[i] + completedStatusArray[i]));
                    elementArray.push(pendingStatusArray[i]);
                    elementArray.push(completedStatusArray[i]);
                    finalArray.push(elementArray);
                })
                console.log('lessons count ==> ', lessonsCount);
                console.log('lessons pending ==> ', pendingStatusArray);
                console.log('lessons completed ==> ', completedStatusArray);
                res.status(200).json(finalArray);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            });
        } else if (selectionType === 1) {
            subjectsArray.forEach(element => {
                pendingStatusArray.push(principalDao.getStudentAssignmentStatus(studentId, element.CURSUBID, 1));
            });
            Promise.all(pendingStatusArray)
            .then((result) => {
                Array.prototype.splice.apply(pendingStatusArray, [0, result.length].concat(result));
                subjectsArray.forEach(element => {
                    completedStatusArray.push(principalDao.getStudentAssignmentStatus(studentId, element.CURSUBID, 2));
                });
                return Promise.all(completedStatusArray);
            })
            .then((result) => {
                Array.prototype.splice.apply(completedStatusArray, [0, result.length].concat(result));
                subjectsArray.forEach((element, i) => {
                    const elementArray = [];
                    elementArray.push(element.SUBJECTNAME);
                    elementArray.push(lessonsCount[i] - (pendingStatusArray[i] + completedStatusArray[i]));
                    elementArray.push(pendingStatusArray[i]);
                    elementArray.push(completedStatusArray[i]);
                    finalArray.push(elementArray);
                });
                res.status(200).json(finalArray);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            });
        }
    })
    .catch(err => {
        next(err);
    })
    .catch(err => {
        next(err);
    });
}

exports.getTeachersGraphicalData = (req, res, next) => {
    const classId = req.body.classId;
    const instCurClassSecId = req.body.instCurClassSecId;
    const teacherId = req.body.teacherId;
    const selectionType = req.body.selectionType;
    let subjectsArray = [];
    let lessonsCount = [];
    let lessonsArray = [];
    let uploadedStatusArray = [];
    let pendingStatusArray = [];
    let completedStatusArray = [];
    let finalArray = [];

    principalDao.getTeacherSubjects(teacherId, instCurClassSecId)
    .then((result) => {
        subjectsArray.push(...result);
        subjectsArray.forEach(element => {
            lessonsCount.push(principalDao.getSubjectLessonsCount(classId, element.CURSUBID));
        });
        return Promise.all(lessonsCount);
    })
    .then((result) => {
        Array.prototype.splice.apply(lessonsCount, [0, result.length].concat(result));
        subjectsArray.forEach(element => {
            lessonsArray.push(principalDao.getSubjectLessons(classId, element.CURSUBID));
        })
        return Promise.all(lessonsArray);
    })
    .then((result) => {
        lessonsArray = result;
        if (selectionType === 0) {
            lessonsArray.forEach(element => {
                const statusArray = [];
                element.forEach(item => {
                    statusArray.push(principalDao.getTeacherVideoStatus(teacherId, item.CURSUBCLASSLESID, 2));
                });
                uploadedStatusArray.push(Promise.all(statusArray));
            });
            Promise.all(uploadedStatusArray)
            .then((result) => {
                uploadedStatusArray = result;
                lessonsArray.forEach(element => {
                    const statusArray = [];
                    element.forEach(item => {
                        statusArray.push(principalDao.getTeacherVideoStatus(teacherId, item.CURSUBCLASSLESID, 3));
                    });
                    pendingStatusArray.push(Promise.all(statusArray));
                });
                return Promise.all(pendingStatusArray);
            })
            .then((result) => {
                pendingStatusArray = result;
                lessonsArray.forEach(element => {
                    const statusArray = [];
                    element.forEach(item => {
                        statusArray.push(principalDao.getTeacherVideoStatus(teacherId, item.CURSUBCLASSLESID, 4));
                    });
                    completedStatusArray.push(Promise.all(statusArray));
                });
                return Promise.all(completedStatusArray);
            })
            .then((result) => {
                completedStatusArray = result;
                uploadedStatusArray = getLessonsCountfromVideos(uploadedStatusArray);
                pendingStatusArray = getLessonsCountfromVideos(pendingStatusArray);
                completedStatusArray = getLessonsCountfromVideos(completedStatusArray);
        
                subjectsArray.forEach((element, i) => {
                    const elementArray = [];
                    elementArray.push(element.SUBJECTNAME);
                    elementArray.push(uploadedStatusArray[i]);
                    elementArray.push(pendingStatusArray[i]);
                    elementArray.push(completedStatusArray[i]);
                    finalArray.push(elementArray);
                });
                res.status(200).json(finalArray);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            });
        } else if (selectionType === 1) {
            lessonsArray.forEach(element => {
                const statusArray = [];
                element.forEach(item => {
                    statusArray.push(principalDao.getTeacherAssignmentStatus(teacherId, item.CURSUBCLASSLESID, 2));
                });
                uploadedStatusArray.push(Promise.all(statusArray));
            });
            Promise.all(uploadedStatusArray)
            .then((result) => {
                uploadedStatusArray = result;
                lessonsArray.forEach(element => {
                    const statusArray = [];
                    element.forEach(item => {
                        statusArray.push(principalDao.getTeacherAssignmentStatus(teacherId, item.CURSUBCLASSLESID, 3));
                    });
                    pendingStatusArray.push(Promise.all(statusArray));
                });
                return Promise.all(pendingStatusArray);
            })
            .then((result) => {
                pendingStatusArray = result;
                lessonsArray.forEach(element => {
                    const statusArray = [];
                    element.forEach(item => {
                        statusArray.push(principalDao.getTeacherAssignmentStatus(teacherId, item.CURSUBCLASSLESID, 4));
                    });
                    completedStatusArray.push(Promise.all(statusArray));
                });
                return Promise.all(completedStatusArray);
            })
            .then((result) => {
                completedStatusArray = result;
                uploadedStatusArray = getLessonsCountfromVideos(uploadedStatusArray);
                pendingStatusArray = getLessonsCountfromVideos(pendingStatusArray);
                completedStatusArray = getLessonsCountfromVideos(completedStatusArray);
        
                subjectsArray.forEach((element, i) => {
                    const elementArray = [];
                    elementArray.push(element.SUBJECTNAME);
                    elementArray.push(uploadedStatusArray[i]);
                    elementArray.push(pendingStatusArray[i]);
                    elementArray.push(completedStatusArray[i]);
                    finalArray.push(elementArray);
                });
                res.status(200).json(finalArray);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            })
            .catch(err => {
                next(err);
            });
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
    });
}


getLessonsCountfromVideos = (teacherStatusArray) => {
    let array = [];
    teacherStatusArray.forEach(element => {
        let count = 0;
        element.forEach(item => {
            if (item !== 0) {
                count += 1;
            };
        });
        array.push(count);
    });
    return array;
}

getsubject = subject => {
    const words = subject.split(' ');
    subject = subject.substring(0,3).toUpperCase();
    if(words.length > 1){                   
        let substr = "";
        for(const i in words){
            if(i > 0)                                         
            substr = substr + words[i].substring(0,1);
        }                       
        subject =subject+substr.toUpperCase();
    }
   return subject;
}

getacadimicsubarray = array => {
    let subarray = [];
    let statusarray = [1,2,3,4];   
    let total = 0;   
    if(array.length === 0){
        subarray.push(0);  
        subarray.push(0);  
        subarray.push(0);  
        subarray.push(0);  
    }
    else{ 
        
        subarray = array.map(ele => {
            statusarray.splice((ele.STATUS - 1),1);
            total = total + Number(ele.completed);
            return ele.completed;
        })
    
        statusarray.forEach(status => {
            subarray.splice((status - 1),0,0); 
        })

    }
    return {subarray,total}
}


getvideochartdata = async (cursubid,subjectname,classid,instcurclasssecid) =>{

    let lessions = await pricipadao.getlessioncount(cursubid,classid);
    let videocompleted = await pricipadao.getvideoscompletedstudents(cursubid,instcurclasssecid);    
    let obj =  getacadimicsubarray(videocompleted);
    let total = obj.total;
    let subaray = obj.subarray;
    let subject = getsubject(subjectname);
    subaray.splice(0, 0,subject);                   
    let nooflessions =  lessions > total ? lessions - total : 0;        
    subaray.splice(1, 0,nooflessions);    
    return {subaray}
}

getassignmentchartdata = async (cursubid,subjectname,classid,instcurclasssecid) =>{

    let lessions = await pricipadao.getlessioncount(cursubid,classid);
    let assigmentcompleted = await pricipadao.getassignmentscompletedstudents(cursubid,instcurclasssecid); 

    let obj =  getacadimicsubarray(assigmentcompleted);
    let total = obj.total;
    let subaray = obj.subarray;
    
    let subject = getsubject(subjectname);
    subaray.splice(0, 0,subject);                   
    let nooflessions =  lessions > total ? lessions - total : 0;                 
    subaray.splice(1, 0,nooflessions);
    return {subaray}
}

exports.getacademicoverview =  async (req,res,next) => {

    const instid = req.body.instid;
    const currculimid = req.body.curid;
    const classid = req.body.classid;
    const sectionid = req.body.secid;
    const type = req.body.type;
    
    const instcurclasssecid = instid.concat(currculimid,classid,sectionid);    
    let subarray = await pricipadao.getcurrculimsubects(currculimid);
    let ary = [];
    try{    
        for await(const val of subarray){
            if(type === 1 || type === '1'){
                let obj = await getvideochartdata(val.CURSUBID,val.SUBJECTNAME,classid,instcurclasssecid);                   
                ary.push(obj.subaray);
            }
            else{
                let obj = await getassignmentchartdata(val.CURSUBID,val.SUBJECTNAME,classid,instcurclasssecid);
                ary.push(obj.subaray);
            }   
        }
        res.status(200).json(ary);
    }
    catch(err){       
        logger.error(`principalcontroller::getacademicoverview :: err - ${err}`)
        next(err)
    }
}

exports.getstudentschartdrpdowndata = (req,res,next) => {

    const instid = req.body.instid;
    const currculimid = req.body.curid;
    const classid = req.body.classid;
    const sectionid = req.body.secid;        
    const instcurclasssecid = instid.concat(currculimid,classid,sectionid); 

    pricipadao.getstudentsbyinstid(instcurclasssecid).then(data => {
       res.status(200).json(data);
    })   
    .catch(err => {
        logger.error(`principalcontroller::getstudentschartdrpdowndata :: err - ${err}`)
        next(err);
    })
}

getstudentchartsubarray = array => {
    let subarray = [];
    let statusarray = [3,4];   
    let total = 0;  

    if(array.length === 0){
        subarray.push(0);  
        subarray.push(0);          
    }
    else{ 
     
        subarray = array.map(ele => {
            statusarray.splice(ele.STATUS == 3 ? 0 : 1,1);
            total = total + Number(ele.completed);
            return ele.completed;
        })
        statusarray.forEach(status => {
            subarray.splice(status == 3 ? 0 : 1,0,0); 
        })

    }
    return {subarray,total}
}

getteachingdatabystudents = async(cursubid,subjectname,classid,secid,studentid) =>{
    let lessions = await pricipadao.getlessioncount(cursubid,classid);
    let videocompleted = await pricipadao.getvideostatusbystudent(cursubid,secid,studentid)

    let obj =  getstudentchartsubarray(videocompleted);
    let total = obj.total;
    let subaray = obj.subarray;
    
    let subject = getsubject(subjectname);
    subaray.splice(0, 0,subject);                   
    let nooflessions =  lessions > total ? lessions - total : 0;                 
    subaray.splice(1, 0,nooflessions);
    return {subaray}
}

getassignmentdatabystudent = async(cursubid,subjectname,classid,secid,studentid) =>{

    let lessions = await pricipadao.getlessioncount(cursubid,classid);
    let assignmentcompleted = await pricipadao.getassignmentstatusbystudent(cursubid,secid,studentid)

    let obj =  getstudentchartsubarray(assignmentcompleted);
    let total = obj.total;
    let subaray = obj.subarray;
    
    let subject = getsubject(subjectname);
    subaray.splice(0, 0,subject);      
    console.log(subject, lessions, total)             
    let nooflessions =  lessions > total ? lessions - total : 0;                 
    subaray.splice(1, 0,nooflessions);
    return {subaray}
    
}
    

exports.getstudentwisedata =  async (req,res,next) => {

    const instid = req.body.instid;
    const currculimid = req.body.curid;
    const classid = req.body.classid;
    const sectionid = req.body.secid; 
    const type = req.body.type;       
    const studentid = req.body.studentid;        
    const instcurclasssecid = instid.concat(currculimid,classid,sectionid);

    let subarray = await pricipadao.getcurrculimsubects(currculimid);
    let ary = [];
    try{    
        for await(const val of subarray){
            if(type === 1 || type === '1'){
                let obj = await getteachingdatabystudents(val.CURSUBID,val.SUBJECTNAME,classid,instcurclasssecid,studentid);                   
                ary.push(obj.subaray);
            }
            else{
                let obj = await getassignmentdatabystudent(val.CURSUBID,val.SUBJECTNAME,classid,instcurclasssecid,studentid);
                ary.push(obj.subaray);
            }   
        }
        res.status(200).json(ary);
    }
    catch(err){       
        logger.error(`principalcontroller::getacademicoverview :: err - ${err}`)
        next(err)
    }

}

/* exports.getstudentwisedata =  (req,res,next) => {

    let noofstudents = pricipadao.gettotalstudentsBysecandsuject(req.body.cursubid, req.body.instcursecid);
    let assignmentscompleted = pricipadao.getassignmentscompletedstudents(req.body.cursubid, req.body.instcursecid);
    let readingcompleted = pricipadao.getreadingcompletedstudents(req.body.cursubid, req.body.instcursecid);
    let videocompleted = pricipadao.getvideoscompletedstudents(req.body.cursubid, req.body.instcursecid);
    
    Promise.all([noofstudents,assignmentscompleted,readingcompleted,videocompleted]).then(data => {
        [students, assignments, reading, videos] = data;
        console.log(`data - ${students[0].studentcount} 
                    assignmnt  completed - ${assignments[0].completed} inprogress - ${students[0].studentcount - assignments[0].completed}
                    reading  completed - ${reading[0].readingcompleted} inprogress - ${students[0].studentcount - reading[0].readingcompleted}
                    video  completed - ${videos[0].videocompleted} inprogress - ${students[0].studentcount - videos[0].videocompleted}        
        `);
    })
} */

exports.getteacherwisedata = (req,res,next) =>{
    
}