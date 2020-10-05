const doubtdao = require('../DAO/doubtdao');
const isEmpty = require('is-empty');
const axios = require('axios');
const logger = require('../util/logfile').log;

preparetecheid = (studentdetails,cursubid) => { 
    
    return studentdetails.then(data => {       
        return data;
    }).then(result => {
       return doubtdao.getteacherid(result[0].dataValues,cursubid);
    }).then(r => {
        return isEmpty(r) ? 'NA' : r[0].dataValues.TEACHERID;
    }).catch(err => {
        console.log('err ', err)
        logger.error('doubtController::prepareteacherid - err '+err+'');
    })
}

preparedoubtobj = (studentdetails,maxseqno,techerid,req) =>{

    const instid = req.body.instituteid;
    const cursubclasslesid = req.body.cursubclasslesid;

    let doubtobj = {};
    doubtobj.INSTID = instid;
    doubtobj.CURSUBID = req.body.cursubid;
    doubtobj.CURSUBCLASSLESID =cursubclasslesid;
    doubtobj.STUDENTID = req.body.studentid;
    doubtobj.DOUBT = req.body.doubt;
    doubtobj.ANSWER = 'NA';
    doubtobj.DOUBTSTATUS = 1;
    doubtobj.CREATEDATETIME = new Date();

    return studentdetails.then(resss => {

        let obj = resss[0].dataValues
        doubtobj.CURRID = obj.CURRID;
        doubtobj.INSTCURID = obj.INSTCURID;
        doubtobj.ClassID = obj.CLASSID;
        doubtobj.INSTCURCLASSID = obj.INSTCURCLASSID;
        doubtobj.INSTCURCLASSSECID = obj.INSTCURCLASSSECID;

        maxseqno.then(r => {    
            let maxseq = r[0].dataValues;
            maxseq = isEmpty(maxseq) ? 1 : Number(maxseq)+1;    
            doubtobj.DOUBTSEQNO = maxseq;
            doubtobj.DOUBTID = instid+cursubclasslesid+maxseq;
        }).catch(err => {
            console.log('err--maxseq',err);
            logger.error('doubtController::maxseq- err- '+err+'');
        }) 

         return techerid.then(id => {        
            doubtobj.TEACHERID = id;
           return doubtobj;
        }).catch(err => {
            console.log('err-techerid ',err);
            logger.error('doubtController::techerid- err '+err+'');
        }) 
       
    }).catch(err => {
        console.log('err-studentdtls ',err);
        logger.error('doubtController::studentdtls- err '+err+'');
    })
}

getteachermobileno = async (teacherid,req,studentdetails) => {

    let teacid = '';
    let msgobj = {};
    await teacherid.then(id => {
        teacid = id;
    }).catch(err => {
        console.log('err-teacherid ',err);
        logger.error('doubtController::teacherid- err '+err+'');
    })

    await studentdetails.then(result => {
        msgobj.name = result[0].dataValues.FIRSTNAME+' '+result[0].dataValues.LASTNAME;        
    })
    .catch(err => {
        console.log('err-studentdetails ',err);
        logger.error('doubtController::studentdetails- err '+err+'',);
    })

    await doubtdao.getlessonandsubject(req.body.cursubclasslesid,req.body.cursubid).then( result => {
    
        msgobj.subject = isEmpty(result) ? 'NA' : result[0].SUBJECTNAME;
        msgobj.lession = isEmpty(result) ? 'NA' : result[0].LESSIONNAME;
        msgobj.class = isEmpty(result) ? 'NA' : result[0].CLASSNAME;
     }).catch(err => {
         console.log('err-join ',err);
         logger.error('doubtController::join- err '+err+'');
     })
    return doubtdao.getteachermobileno(teacid).then(mob => {
        msgobj.mobile = isEmpty(mob) ? 'NA' : mob[0].dataValues.MOBILENO;        
        return msgobj;
    })
    .catch(err => {
        console.log('err-getteachermobileno ',err);
        logger.error('doubtController::getteachermobileno- err  '+err+'');
    })
}

exports.savedoubt = (req, res) => { 

    let studentdetails = Promise.resolve(doubtdao.getstudentdetials(req.body.studentid));
    let maxseqno = Promise.resolve(doubtdao.getmaxseqno());
    let techerid = Promise.resolve(preparetecheid(studentdetails,req.body.cursubid));
    let doubtcreate = Promise.resolve(preparedoubtobj(studentdetails,maxseqno,techerid,req));
    let regtechermobile = Promise.resolve(getteachermobileno(techerid,req,studentdetails));  

    doubtcreate.then(r => {
        logger.info('doubtController::doubtcreate :: result - '+r+'');
        doubtdao.createdoubt(r).then( result => {

            console.log('regtechermobile  ',regtechermobile);
            sendmsg(regtechermobile, true);              
            res.status(200).json({status: result ? true : false});
        })
        .catch(err => {
            console.log('err ',err);
            logger.error('doubtController::doubtcreate :: err - '+err+'')
            res.status(200).json({status:  false});
        })
    }) 
    
}

getdoubts = req => {
  
    const frmdate = req.body.frmdate;
    const todate = req.body.todate;
   
    let fdate =new Date(frmdate.slice(6,10),Number(frmdate.slice(3,5))-1,Number(frmdate.slice(0,2))+1);
    let tdate =new Date(todate.slice(6,10),Number(todate.slice(3,5))-1,Number(todate.slice(0,2))+1);
    fdate.setDate(fdate.getDate()-1);
    tdate.setDate(tdate.getDate()-1);
    return doubtdao.getdoubtsdata(req.body.doubtfor,req.body.isanswer,fdate,tdate,req.body.studenid,req.body.logintype,req.body.subid,req.body.lesid,req.body.instid,req.body.secid);    
}

exports.getdoubts = (req, res) => { 

    let unanswereddoubts = Promise.resolve(getdoubts(req));
    unanswereddoubts.then(r => {
       res.status(200).json(r);
    }).catch(err =>{
        console.log('err ',err);
        res.status(200).json([]);
    })
}

sendmsg = (msgdata,issavedoubt) => {
    msgdata.then(obj => {
        let msg = issavedoubt ? 'New doubt has been raised with following details \nStudent : '+ obj.name+'\nClass : '+obj.class+'\nSubject : '+ obj.subject+'\nTopic : '+ obj.lession
                              : 'Dobut has been clarified for following details \nSubject  : '+obj.subject+'\nTopic :'+obj.lession;

        axios.get('http://sms.sms4finsol.com/WebserviceSMS.aspX',{
         params: {User:'sms4finsol',passwd:'41490561',mobilenumber:obj.mobile,message:msg,sid:'FINSOL',mtype:'N',DR:'Y'}
        }).then(response =>{                                           
            console.log('response',response.status);
            logger.info('doubtController::sendmsg :: response - '+response.status+'');
        })
        .catch(err => {
            console.log('err- sendmsg',err)
            logger.error('doubtController::sendmsg :: err - '+err+'')                
        })        

    })
}

preparemsgobj = async id => {

    let obj = {};
    await doubtdao.getlessonid(id).then(result => {
        obj.lesid = result[0].dataValues.CURSUBCLASSLESID;
        obj.cursubid = result[0].dataValues.CURSUBID;
        obj.studentid = result[0].dataValues.STUDENTID;
    })

    await doubtdao.getlessonandsubject(obj.lesid,obj.cursubid).then( result => {
       obj.subject = result[0].SUBJECTNAME;
       obj.lession = result[0].LESSIONNAME;
    }).catch(err => {
        console.log('err-join ',err);
        logger.error('doubtController::getlessonandsubject :: err - '+err+'')
    })

    return doubtdao.getstudentmobileno(obj.studentid).then(mob => {
        obj.mobile = mob[0].dataValues.MOBILENO;
        return obj;
    })
    .catch(err => {
        console.log('err-getstudentmobileno ',err);
        logger.error('doubtController::getstudentmobileno :: err - '+err+'')
    })
}


exports.saveanswer = (req,res) => {
    let msgdata = Promise.resolve(preparemsgobj(req.body.id));  
    doubtdao.updateanswer(req.body.answer,new Date(),req.body.id,req.body.teacherid)
    .then(result => {       
        sendmsg(msgdata, false);    
        res.status(200).json({"status":true});
    })
    .catch(err => {
        console.log('err ',err);
        logger.error('doubtController::saveanswer :: err - '+err+'')
        res.status(200).json({"status":false});
    })
}

