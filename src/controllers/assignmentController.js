
const assignDao = require('../DAO/assignmentDAO');
const isNumber = require('is-number');
const isempty = require('is-empty');
prepareassignmentobj = (obj,teachersub,lessid,seqid) => {

    let assignmentobj= {};
    assignmentobj.INSTID= obj.INSTID;
    assignmentobj.TITLE= obj.TITLE;
    assignmentobj.CURSUBID= obj.CURSUBID;
    assignmentobj.CURSUBCLASSLESID= obj.CURSUBCLASSLESID;
    assignmentobj.TEACHERID= obj.TEACHERID;
    assignmentobj.CREATEDBY= obj.CREATEDBY;
    assignmentobj.ASSIGNMENTSTATUS= obj.ASSIGNMENTSTATUS;
    assignmentobj.TOTALMARKS= obj.TOTALMARKS;    
    assignmentobj.ASSIGNMENTMODE = obj.ASSIGNMENTMODE;
    assignmentobj.INSTCURCLASSSECID=obj.INSTCURCLASSSECID;    
    assignmentobj.CREATEDDATE = new Date();


    teachersub.then(result => {
        let subobj = result[0].dataValues;
        assignmentobj.CURRID=subobj.CURRID;
        assignmentobj.INSTCURID=subobj.INSTCURID;
        assignmentobj.CLASSID=subobj.CLASSID;
        assignmentobj.INSTCURCLASSID=subobj.INSTCURCLASSID;
    })
    .catch(err => {
        console.log('err - teachersub ',err);
    })

     lessid.then(id => {
        assignmentobj.LESSONSLNO=id;
    })
    .catch(err => {
        console.log('err - lessid ',err);
    })

    return seqid.then(id => {
        assignmentobj.ASSIGNMENTSEQID = id;
        assignmentobj.ASSIGNMENTID = obj.INSTID+obj.CURSUBCLASSLESID+id;
        return assignmentobj;
    })
    .catch(err => {
        console.log('err - seqid ',err);
    })
}

getlessionid = obj => {
    return assignDao.getlessionid(obj.CURSUBCLASSLESID).then( result => {
        return result[0].dataValues.LESSIONID;
    })
    .catch(err => {
        console.log('err - getlessionid() ',err);
    })
 }

getteachersubdata = obj => {
   return assignDao.getteacherdata(obj.TEACHERID,obj.CURSUBID);
}

getassignmentseqid = (secid,subid) =>{
    return assignDao.getassignmentseq(secid,subid).then(r => {                     
        let seq = isNumber(r) ? Number(r)+1 : 1;          
        return seq;
    }).catch(err => {
        console.log('err--getassignmentseqid',err);
        return 0;
    })
}

exports.addasignment = (req,res) => {

    let assignmentobj = req.body.assignment;
    let qtnary = req.body.qtnary;
    let teachersub = Promise.resolve(getteachersubdata(assignmentobj));
    let lessid = Promise.resolve(getlessionid(assignmentobj));
    let seqid = Promise.resolve(getassignmentseqid(assignmentobj.INSTCURCLASSSECID,assignmentobj.CURSUBID));
    let assigobj =  Promise.resolve(prepareassignmentobj(assignmentobj,teachersub,lessid,seqid));
  
    let assignmentid = getassignmentid(assigobj);
    let maxseqno = Promise.resolve(getseqnoquestion());
    let assignqtn = Promise.resolve(preparequestionarray(qtnary,maxseqno,assignmentid));
           
    let saveassign = Promise.resolve(savedata(assigobj,assignqtn));

    saveassign.then(result => {       
        res.status(200).json({status:  result});
    })
    .catch(err => {
        console.log('err - addasignment() ',err);  
        res.status(200).json({status:  false});     
    })
    
}
getassignmentid = async assigobj => {    
    return await assigobj.then(obj => {
       return obj.ASSIGNMENTID;  
    })
}
savedata = async(assigobj,assignqtn) => {

    let assignobj = {};
    let assignqtnary = [];

    await assigobj.then(obj => {
        assignobj = obj;
    })

    await assignqtn.then(ary => {
        assignqtnary = ary;
    })

   return assignDao.saveassignment(assignobj,assignqtnary).then(issave => {
       return issave;
   })

}

preparequestionarray = async(qtnarray,maxseqno,assignmentid) => {

   let seq = 0
   await maxseqno.then(r => { seq = r;})

   let assignmentarray=[];
   let i =0;
    for(let value of qtnarray)
    {     
        seq = i == 0 ? seq : seq +1;
        let questionsobj = Promise.resolve(preparequestionobj(value,seq,assignmentid));
        await questionsobj.then(obj => {           
            assignmentarray.push(obj);            
        }).catch(err => {
            console.log('err ',err);
        })  
        i = i+1;    
    }
    return assignmentarray;
}
getseqnoquestion = () =>{
    return assignDao.getquestionseqno().then(r => {                    
        seq = isNumber(r) ? Number(r)+1 : 1;       
        return seq;
    }).catch(err => {
        console.log('err--getseqnoquestion',err);
        return 0;
    })
}

preparequestionobj =(obj,seq,assignmentid)=>{
    let qtnobj = {};
       
    qtnobj.ASSIGNMENTQN= obj.ASSIGNMENTQN;
    qtnobj.OP1= obj.OP1;
    qtnobj.OP2= obj.OP2;
    qtnobj.OP3= obj.OP3;
    qtnobj.OP4= obj.OP4;

    qtnobj.CHK1= obj.CHK1 ? obj.CHK1 : false;
    qtnobj.CHK2= obj.CHK2 ? obj.CHK2 : false;
    qtnobj.CHK3= obj.CHK3 ? obj.CHK3 : false;
    qtnobj.CHK4= obj.CHK4 ? obj.CHK4 : false;

    let answer = "NA";
    if(obj.CHK1) answer = obj.OP1;
    if(obj.CHK2) answer = obj.OP2;
    if(obj.CHK3) answer = obj.OP3;
    if(obj.CHK4) answer = obj.OP4;

    qtnobj.ANSWER= answer;
    qtnobj.QNSLNO= seq;
   
     return assignmentid.then(id => {       
        qtnobj.ASSIGNMENTID= id;   
        qtnobj.ASSIGNMENTQNID= id+seq;
        return qtnobj;
    })
    .catch(err => {
        console.log('err preparequtionobj-maxseq ',err);
    })
}

exports.getmodelquestions = async(req, res) => {

    await assignDao.getmodelquestions(req.body.classid,req.body.cursubid).then(result => {
       let retary = [];
       
        result.forEach(ele => {
          
          let obj = {};
         
          obj.ASSIGNMENTQN = ele.dataValues.QTN;
          obj.OP1 = ele.dataValues.OP1;
          obj.OP2 = ele.dataValues.OP2;
          obj.OP3 = ele.dataValues.OP3;
          obj.OP4 = ele.dataValues.OP4;
          
          obj.CHK1 = obj.OP1 == ele.dataValues.ANSWER ? true : false;
          obj.CHK2 = obj.OP2 == ele.dataValues.ANSWER ? true : false;
          obj.CHK3 = obj.OP3 == ele.dataValues.ANSWER ? true : false;
          obj.CHK4 = obj.OP4 == ele.dataValues.ANSWER ? true : false;          
          retary.push(obj);
        }) 
        res.status(200).json(retary);
    })
    .catch(err => {
        console.log('err ',err);
        res.status(200).json([]);
    })
}


exports.getaddedassignments = (req, res) => {

    assignDao.getaddedassignments(req.body.teacherid,req.body.subid,req.body.lessonid,req.body.classid).then(result => {
        res.status(200).json(result);
    })
    .catch(err => {
        console.log('err ',err);
        res.status(200).json([]);
    })
}

getassignmentdatabyid = assignmentid => {
    return assignDao.getassignmentbyid(assignmentid).then(result => {
            return result[0].dataValues;
    })
}

getassignmentqtndatabyid = assignmentid => {
    return assignDao.getassignmentqtnbyid(assignmentid).then(result => {
        return result;
    })
}

prepareretobj = (assignmetdata,assignmetqtndata) => {

    let retobj = {};
    assignmetdata.then(result => {
        retobj.assignment = result;       
    }).catch(err => {console.log('err ',err)})

    return assignmetqtndata.then(result => {
        retobj.qtnary = result;
        return retobj;
    }).catch(err => {console.log('err ',err)})

}

exports.getassignmetsdatabyid = (req, res) => {

    const assignmentid = req.body.assignmentid;     
    const assignmetdata = Promise.resolve(getassignmentdatabyid(assignmentid));
    const assignmetqtndata = Promise.resolve(getassignmentqtndatabyid(assignmentid));
    const retobj = Promise.resolve(prepareretobj(assignmetdata,assignmetqtndata));

    retobj.then(result => {
        res.status(200).json(result);
    }).catch(err => {
        console.log('err ', err);
        res.status(200).json({});
    })

}

updatedata = async(assignmentobj,assignqtn) => {
    let assignqtnary = [];
    await assignqtn.then(ary => {
        assignqtnary = ary;
    })   
    return assignDao.saveassignmentbyid(assignmentobj,assignqtnary).then(r => {
        return r;
    })
}

getidbypromice = id => {
return id;
}

exports.saveassignbyid = (req, res) => {
    
    let assignmentobj = req.body.assignment;
    let qtnary = req.body.qtnary;

    let assignmentid = Promise.resolve(getidbypromice(assignmentobj.ASSIGNMENTID));   
    let maxseqno = Promise.resolve(getseqnoquestion());
    let assignqtn = Promise.resolve(preparequestionarray(qtnary,maxseqno,assignmentid));

    let isupdate = Promise.resolve(updatedata(assignmentobj,assignqtn));

    isupdate.then(isupdate => {
        res.status(200).json({"status" : isupdate});
    }).catch(err => {
        console.log('err ', err);
        res.status(200).json({"status" : false});
    }) 

}

exports.updateassignstatus = (req, res, next) => {

    let assignmentid = req.body.assignmentid;
    let obj = {};
    obj.ASSIGNMENTSTATUS = req.body.status;
   
    assignDao.updateassignmentstatus(obj,assignmentid).then(result => {
        res.status(200).json({"status" : result ? true : false});
    }).catch(err => {
        console.log('err ', err);
        return next(err);
    })

}

getstudentattemptid = (studentid,assignmentid) => {
    return assignDao.getstudentattempid(studentid,assignmentid).then(r => {        
        let attemptid = isNumber(r) ? Number(r)+1 : 1;           
        return attemptid;
    }).catch(err => {
        console.log('err--getstudentattemptid',err);
        return 0;
    })
}

/* geteachqtnmark = (totalmarks,assignmentid) => {
    return assignDao.getnoofqtns(assignmentid).then(qtns => {        
        let mark = totalmarks/qtns;       
        return mark;
    })
} */

getsubmitobjet = async (array,mark,obj,attemptid) => {

    let atmpid = 0 ;
    await attemptid.then(id => {
        atmpid = id;
    }).catch(err => {console.log('attemptid err ',err)})

    let finalarray = [];
    let recvmarks = 0;    
    await array.forEach(elm => {
        
       let subobj = {};
       subobj.ASSIGNMENTQNID = elm.ASSIGNMENTQNID;
       subobj.SELECTEDOPTION = elm.SELECTEDOPTION;
       subobj.ANSWER = elm.ANSWER;
       subobj.ISITCORRECT = elm.SELECTEDOPTION == elm.ANSWER ? true : false;
       subobj.STUDENTATTEMPTID = atmpid;
       subobj.STUDENTID = obj.STUDENTID;
       subobj.ASSIGNMENTID = obj.ASSIGNMENTID;
       let qtnmark = subobj.ISITCORRECT ? mark : 0;
       recvmarks = recvmarks + qtnmark;
       finalarray.push(subobj);
    })
    let submissionobj = {};
    submissionobj.ary = finalarray;
    
    let percent = (recvmarks/obj.TOTALMARKS)*100;

    submissionobj.submission = {
      "ASSIGNMENTID": obj.ASSIGNMENTID,
      "STUDENTID": obj.STUDENTID,
      "STUDENTATTEMPTID": atmpid,
      "SUBMISSIONSTATUS": recvmarks == obj.TOTALMARKS ? 2 : 1,
      "SUBMITTEDDATE": new Date(),
      "RECDMARKS":recvmarks,
      "TOTALMARKS": obj.TOTALMARKS,
      "PERCENT":percent,
      "CURSUBID":obj.CURSUBID,
      "INSTCURCLASSSECID":obj.INSTCURCLASSSECID,
      "CURSUBCLASSLESID":obj.CURSUBCLASSLESID,
    }   
    return submissionobj;
}

savesubmission = subobj => {
    return subobj.then(obj => {
        return assignDao.savesubmission(obj)
        .then(isave => {
            return isave;
        }).catch(err => {
            console.log('submission err',err);
        })
    });
}

getStudentwiseSubmitObject = async(array, mark, obj) => {
    let recvmarks = 0;    
    await array.forEach(elm => {
        let subobj = {};
        subobj.ISITCORRECT = elm.SELECTEDOPTION == elm.ANSWER ? true : false;
        let qtnmark = subobj.ISITCORRECT ? mark : 0;
        recvmarks = recvmarks + qtnmark;
    });
    let submissionObj = {
        "STUDENTID": obj.STUDENTID,
        "ASSIGNMENTSTATUS": recvmarks == obj.TOTALMARKS ? 2 : 1,
        "CURSUBID":obj.CURSUBID,
        "INSTCURCLASSSECID":obj.INSTCURCLASSSECID,
        "CURSUBCLASSLESID":obj.CURSUBCLASSLESID,
    };
    return submissionObj;
}

savestudentleswisesubmission = subobj => {
    let totalAssignmentCountinLesson;
    let studentAssignmentCountinLesson;
    return subobj.then(obj => {
        return assignDao.getstudentleswisestatusrecord(obj.STUDENTID, obj.CURSUBCLASSLESID, obj.INSTCURCLASSSECID)
        .then((result) => {
            if (result) {
                if (obj.ASSIGNMENTSTATUS === 1) {
                    console.log('control went into if condition ===========================================> ');
                    console.log('student obj ====> ', obj);
                    return assignDao.updatestudentleswisestatusrecord(obj)
                    .then(isave => {
                        return isave;
                    }).catch(err => {
                        console.log('submission err',err);
                    }) 
                } else if (obj.ASSIGNMENTSTATUS === 2) {
                    console.log('control went into else condition ==========================================> ');
                    return assignDao.getAssignmentCountPerLessonForTeacher(obj.CURSUBCLASSLESID, obj.INSTCURCLASSSECID)
                    .then((result) => {
                        totalAssignmentCountinLesson = result[0].totalAssignmentCountinLesson;
                        console.log('total assignment count in lesson=====> ', totalAssignmentCountinLesson);
                        return assignDao.getAssignmentCountPerLessonForStudent(obj.STUDENTID, obj.CURSUBCLASSLESID, obj.INSTCURCLASSSECID);
                    })
                    .then((result) => {
                        studentAssignmentCountinLesson = result[0].studentAssignmentCountinLesson;
                        console.log('student assignment count in lesson=====> ', studentAssignmentCountinLesson);
                        totalAssignmentCountinLesson === studentAssignmentCountinLesson ? obj.ASSIGNMENTSTATUS = 2 : obj.ASSIGNMENTSTATUS = 1;
                        console.log('student obj ====> ', obj);
                        return assignDao.updatestudentleswisestatusrecord(obj)
                        .then(isave => {
                            return isave;
                        }).catch(err => {
                            console.log('submission err',err);
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .catch(err => {
                        console.log(err);
                    })
                }
            } else {
                return assignDao.savestudentleswisesubmission(obj)
                .then(isave => {
                    return isave;
                }).catch(err => {
                    console.log('submission err',err);
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
    });
}

updateassignmentstatus = async(secid,assignmentid,currsubid) => {
   let totalstudents = 0;
   let submittedstudents = 0;

   await assignDao.getnoofstudentsforsec(secid,currsubid)
   .then(count => {
      totalstudents = count;
    }).catch(err => {
        console.log('err--maxseq ===============================================>',err);       
    })

    await assignDao.fetchsubmittedstudents(assignmentid)
    .then(count => {
        submittedstudents = count;
    })
    .catch(err => {
        console.log('err--maxseq =======================================>',err);       
    })

    let obj = {};
    obj.ASSIGNMENTSTATUS = totalstudents === submittedstudents ? 4 : 3;
   
    return  assignDao.updateassignmentstatus(obj, assignmentid)
    .then(result => {
        return result;
    });
}

exports.saveassignsubmission= (req, res, next) => {
   
    let submission = req.body.submission;
    let subqtnarray = req.body.subqtnary;
    let subjectid = req.body.cursubid;
    console.log('subqtnarray  ',subqtnarray.length);
    let studentattemtid = Promise.resolve(getstudentattemptid(submission.STUDENTID,submission.ASSIGNMENTID));   

    let mark =submission.TOTALMARKS/subqtnarray.length;
    let subobj = Promise.resolve(getsubmitobjet(subqtnarray,mark,submission,studentattemtid));
    let issubmitted = Promise.resolve(savesubmission(subobj));
    let studentleswisesubobj = Promise.resolve(getStudentwiseSubmitObject(subqtnarray, mark, submission));
    let isstudentleswisesubmitted = Promise.resolve(savestudentleswisesubmission(studentleswisesubobj));
    
    issubmitted
    .then(result => {
        if (result) {
            return isstudentleswisesubmitted;
        }
    })
    .then(result => {
        console.log('student wise lesson updationnnnnnnnnn', result);
        if (result) {
            return Promise.resolve(updateassignmentstatus(submission.INSTCURCLASSSECID, submission.ASSIGNMENTID, submission.CURSUBID));
        }
    })
    .then(result => {
        if (result) {
            res.status(200).json({"status":true});
        }
    })
    .catch(err => {
        console.log('err ',err)
        res.status(200).json({"status":err});
    })
    .catch(err => {
        console.log('err ',err)
        res.status(200).json({"status":err});
    })
    .catch(err => {
        console.log('err ',err)
        res.status(200).json({"status":err});
    })
}

getassignmentdataforstudent = async req => {    
   return  await assignDao.fetchassignmentsforstudents(req.body.secid,req.body.subid,req.body.lesid).then( async result => {       
        for await(const val of result){
            await assignDao.getsubmissionstatus(val.dataValues.ASSIGNMENTID,req.body.studentid).then(r => {           
                val.dataValues.SUBMISSIONSTATUS = isempty(r) ? 0 : r.dataValues.SUBMISSIONSTATUS;
            }).catch(err => {console.log('err ',err);})         
        }
        return result;
    }).catch(err => {console.log('err ',err);})
}

exports.fetchassignmetsforstudents = (req, res) => {
    let assignmentarray =  getassignmentdataforstudent(req);
    assignmentarray.then(r =>{      
        res.status(200).json(r);
    }).catch(err => {
        console.log('err ',err);
        res.status(200).json({});
    })
}

prepareassignmentforstudent = assignmentid => {

    let finalobj = {};
    assignDao.fetchassignmentbyid(assignmentid).then(result => {     
       finalobj.submission =  result[0].dataValues;
    }).catch(err => {console.log('err-data ',err)})

    return assignDao.fetchassignmentqtnsbyid(assignmentid).then(result => {

        let qtnarray = []
        result.forEach(ele => {            
            let ary = [];
            ary.push(ele.dataValues.OP1);
            ary.push(ele.dataValues.OP2);
            ary.push(ele.dataValues.OP3);
            ary.push(ele.dataValues.OP4);

            let obj = {
                "ASSIGNMENTQN":ele.dataValues.ASSIGNMENTQN,
                "ASSIGNMENTQNID":ele.dataValues.ASSIGNMENTQNID,
                "ANSWER":ele.dataValues.ANSWER,
                "Answerlist":ary
            }            
            qtnarray.push(obj); 
        })
        finalobj.subqtnary =  qtnarray;       
        return finalobj;
    }).catch(err => {console.log('err-array ',err)})
} 

exports.fetchassignmetbyid = (req, res) => {

    let assignmentid = req.body.ASSIGNMENTID;
    let retobj = Promise.resolve(prepareassignmentforstudent(assignmentid));

    retobj.then(result => {
        console.log('result ',result);
        res.status(200).json(result);
    })
    .catch(err => {
        console.log('err ',err);
        res.status(200).json({});
    })
}

exports.getstudentresults = (req, res) => {

    assignDao.getstudentresults(req.body.assignmentid,req.body.studentid).then(result => {
        res.status(200).json(result);
    }) .catch(err => {
        console.log('err ',err);
        res.status(200).json({});
    })

}