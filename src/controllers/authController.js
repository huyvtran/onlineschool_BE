const al = require('../models/accessibilityLevels');
const activitymaster = require('../models/activityMaster');
const cityMaster = require('../models/cityMaster');

const cm = require('../models/countrymaster');
const cs = require('../models/curriculamSubjects');

const dm = require('../models/districtMaster');
const groups = require('../models/groups');
const ic = require('../models/instituteClasses');
const icrm = require('../models/instituteCurriculum');
const itm = require('../models/instituteTypeMaster')
const institutionMaster = require('../models/institutionMaster')
const pm = require('../models/parentMaster');
const pmr = require('../models/principalMaster');

const stm = require('../models/statemaster');
const sttm = require('../models/studentMaster');
const ss = require('../models/studentSubjects');
const sbm = require('../models/subjectMaster');
const ttm = require('../models/teacherMaster');
const ts = require('../models/teacherSubjects');
const tvs = require('../models/teachervideo');
const stlng = require('../models/studentsListening');
const stvdsts = require('../models/studentVideoStatus');
const Login = require('../models/loginModel');
const cclmsl = require('../models/curriculamSubLessions');
const sln = require('../models/studentsListening');
const alActivities = require('../models/alActivities');
const studentReading = require('../models/studentReading');
const studentleswiseassignmentstatus = require('../models/studentlessonwiseassignmentstatus');

const generator = require('generate-password'); 
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const OTP = require('../models/otpStorage');
const AuthDAO = require('../DAO/authDAO');
const logger = require('../util/logfile').log;
// environment = require('..')

exports.mobilenumberExistsorNot = (req, res, next) => {
    const mobilenumber = req.body.mobilenumber;
    Login.findOne({
        attributes: ['patientname', 'mobilenumber'],
        where: {mobilenumber: mobilenumber}
    }).then(user => {
        if (!user) {
            res.status(200).json({
                status: false
            });
            return;
        }
        res.status(200).json({
            status: true
        });
    }).catch(err => {
        return next(err);
    })
}

exports.getMobileNumberwithUuid = (req, res, next) => {
    const uuid = req.body.uuid;
    console.log(uuid);
    Login.findOne({
        attributes: ['patientname', 'mobilenumber'],
        where: {uuid: uuid}
    }).then(user => {
        if (!user) {
            res.status(200).json({
                status: false
            });
            return;
        }
        const userName = user.patientname;
        const mobilenumber = user.mobilenumber;
        res.status(200).json({
            userName: userName,
            mobileNumber: mobilenumber,
            status: true
        });
    })
    .catch(err => {
        return next(err); 
    })
}

exports.loginUser = async(req, res, next) => {
    const loginid = req.body.loginid;
    const password = req.body.password;
    const uuid = req.body.uuid;

    let userobj;
    AuthDAO.findUser(loginid)
    .then(user => {
        // console.log('user is =======> ', user);
    if (!user) {
        res.status(200).json({
            message: 'Please check the given loginid',
            statusCode: 200,
            isAuthenticated: false
        });
        return false;
    }            
        userobj = user;
        console.log(password,user.password);
        return bcrypt.compare(password.toString(), user.password);
    })
    .then((validuser) => {
        console.log('usr is authenticated or not=====> ', validuser);
    if (validuser) {
        if(!userobj.isfirsttimelogin) {
            AuthDAO.updateUuid(uuid, loginid)
            .then(result => {})
            .catch(err => { 
                console.log(err);
                next(err);
            })
        }
        
        let retobj = {
            message: 'user authenticated', 
            statusCode: 200, 
            isAuthenticated: validuser,
            userloginid : userobj.loginid,
            userName : userobj.username,
            isNewlogin : userobj.isfirsttimelogin,
            accesslevelid : userobj.accesslevelid,
            groupid : userobj.groupid,
            instituteid: userobj.institutionid,
            mobileno: userobj.mobileno,
            email: userobj.email
        }

        if(userobj.accesslevelid === '1' && userobj.groupid === '2') {

            AuthDAO.getidbylogin(userobj.accesslevelid, userobj.groupid, userobj.loginid)
            .then(result => {
                retobj.studentid = null;
                retobj.teacherid = result[0].dataValues.TEACHERID;
                res.status(200).json(retobj)
            }).catch(err => {
                console.log(err);
                next(err);
            })

        }
        else if(userobj.accesslevelid === '1' && userobj.groupid === '3') {

            AuthDAO.getidbylogin(userobj.accesslevelid, userobj.groupid, userobj.loginid)
            .then(result => {
                retobj.studentid = result[0].dataValues.STUDENTID;
                retobj.teacherid = null;
                res.status(200).json(retobj)
            }).catch(err => {
                console.log(err);
                next(err);
            });
        }
        else{
            res.status(200).json(retobj)
        }
    }
    else{
        res.status(200).json({ 
            message: 'user not authenticated', 
            statusCode: 200, 
            isAuthenticated: validuser                
        })
    }
    })
    .catch(err => {
        next(err);
    })
    .catch(err => {
        next(err);
    })
}

exports.loginWithMpin = (req, res, next) => {
    
    const uuid = req.body.uuid;
    const otp1 = req.body.otp1;
    const otp2 = req.body.otp2;
    const otp3 = req.body.otp3;
    const otp4 = req.body.otp4;

    const mpin = otp1.toString()+otp2.toString()+otp3.toString()+otp4.toString();

    console.log('mpin  ',mpin);

    Login.findOne({
        where: {uuid: uuid, mpin: mpin}
    }).then(user => {
        if (user === null) {
            res.status(200).json({
                message: 'user is not authenticated',
                statusCode: 200,
                isAuthenticated: false
            });
        } else {
           
            let retobj = {
                message: 'user authenticated',
                statusCode: 200,
                userName: user.username,
                isNewlogin : user.isfirsttimelogin,
                userloginid: user.loginid,
                accesslevelid : user.accesslevelid,
                groupid : user.groupid,
                instituteid: user.institutionid,
                isAuthenticated: true,
                mobileno: user.mobileno,
                email: user.email
            }

            if(user.accesslevelid === '1' && user.groupid === '2') {

                AuthDAO.getidbylogin(user.accesslevelid, user.groupid, user.loginid)
                .then(result => {
                    retobj.studentid = null;
                    retobj.teacherid = result[0].dataValues.TEACHERID;
                    res.status(200).json(retobj)
                }).catch(err => {
                    console.log(err);
                })
    
            } else if(user.accesslevelid === '1' && user.groupid === '3') {
    
                AuthDAO.getidbylogin(user.accesslevelid, user.groupid, user.loginid)
                .then(result => {
                    retobj.studentid = result[0].dataValues.STUDENTID;
                    retobj.teacherid = null;
                    res.status(200).json(retobj)
                }).catch(err => {
                    console.log(err);
                });
    
            } else{
                res.status(200).json(retobj)
            }        
        }
    })
    .catch(err => {
        return next(err); 
    })
}

exports.checkMpin = (req, res, next) => {
    const mpin = req.body.mpin;
    const mobilenumber = req.body.mobilenumber;
    Login.findOne({
        attributes: ['mpin'],
        where: {mobilenumber: mobilenumber, mpin: mpin}
    }).then(result => {
        if (result) {
            res.status(200).json({
                status: true,
                message: 'mPIN matched'
            });
        } else {
            res.status(200).json({
                status: false,
                message: 'mPIN not matched'
            });
        }
        
    })
    .catch(err => {
        return next(err); 
    })
}

exports.changeMobilePin = (req, res, next) => {
    const mobilenumber = req.body.mobilenumber;
    const mpin = req.body.mpin;
    Login.update(
        { mpin: mpin },
        {
            where: {mobilenumber: mobilenumber}
        }
    ).then(result => {
        if (result[0]) {
            res.json({
                status: true,
            });
            return;
        }
        res.status(200).json({
            status: false
        });
    })
    .catch(err => { 
        return next(err); 
    })
}

exports.resetPassword = (req, res, next) => {

    const loginid = req.body.loginid;
    const mobilenumber = req.body.mobilenumber;

    logger.info('authController::resetPassword :: loginid - '+loginid+'');
    logger.info('authController::resetPassword :: mobilenumber - '+mobilenumber+'');

    var password = generator.generate({
        length: 6,
        numbers: true
    });

    let message = 'Your password has been reset successfully and your new password is '+password+'.'
    
    bcrypt.hash(password.toString(), 12)
    .then(hashedPassword => {
       return Login.update(
           {password: hashedPassword, mpin: 7894, isfirsttimelogin: true}, {where: {loginid: loginid}});
    })
    .then(result => {
        if (result[0]) {            
            let url = 'http://sms.sms4finsol.com/WebserviceSMS.aspX?User=sms4finsol&passwd=41490561&mobilenumber='+ mobilenumber +'&message= '+ message +' &sid=FINSOL&mtype=N&DR=Y';
            let sms = axios.get(url);            
            res.json({ status: sms ? true : false, message: 'Password Successfully Updated'});
        } else {
            res.json({ status: false, message: 'Failed to Update Password'});
        }

    })
    .catch(err => {
        logger.error('authController::resetPassword :: err - '+err+'')
        return next(err);
    })
    .catch(err => {
        logger.error('authController::resetPassword :: err - '+err+'')
        return next(err);
    })
}

exports.changepassword = (req, res, next) => {

    const loginid = req.body.loginid;
    const password = req.body.password;
    
    bcrypt.hash(password.toString(), 12)
    .then(hashedPassword => {
       return Login.update(
           {password: hashedPassword}, {where: {loginid: loginid}});
    })
    .then(result => {
        if (result[0]) { res.json({ status: true, message: 'Password Successfully Updated'});}
        else { res.json({ status: false, message: 'Failed to Update Password'});}
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    })
}

exports.generateOTP = (req, res, next) => {

    const loginid = req.body.loginid;
    const mobilenumber = req.body.mobilenumber;
    const purpose = req.body.purpose;

    const otp = otpGenerator.generate(4, { upperCase: false, specialChars: false,alphabets: false });
    const time = new Date();
    const message = 'Your verification code is ' + otp;
    const otpObj = {
        loginid: loginid,
        mobilenumber: mobilenumber,
        otp: otp,
        purpose: purpose,
        generatedTime: time
    };

    console.log('otpObj ',otpObj)

    OTP.destroy({
        where:{loginid:loginid,mobilenumber:mobilenumber,purpose:purpose}
    })
    .catch(err => {
        console.log('err ',err)
    })

    OTP.create(otpObj)
    .then( r => {
        if (r) {
            let url = 'http://sms.sms4finsol.com/WebserviceSMS.aspX?User=sms4finsol&passwd=41490561&mobilenumber='+ mobilenumber +'&message= '+ message +' &sid=FINSOL&mtype=N&DR=Y';
            return axios.get(url);

           /* return  axios.get('http://sms.sms4finsol.com/WebserviceSMS.aspX',{
                params: {User:'sms4finsol',passwd:'41490561',mobilenumber:mobilenumber,message:message,sid:'FINSOL',mtype:'N',DR:'Y'}
            }).then(response =>{
              return response
            })
            .catch(err => {
                console.log('err   ',err)
            }) */
            

        }
    })
    .then(result => {       
        if (result) {
            res.status(200).json({
                status: true,
                statusText: result.statusText,
                message: result.data
            });
        }
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    });

    
}

exports.verifyOTP = (req, res, next) => {

    const mobilenumber = req.body.mobilenumber;    
    const purpose = req.body.purpose;
    const otp1 = req.body.otp1;
    const otp2 = req.body.otp2;
    const otp3 = req.body.otp3;
    const otp4 = req.body.otp4;

    const otp = otp1.toString()+otp2.toString()+otp3.toString()+otp4.toString();


    OTP.findOne({
        attributes: ['mobilenumber', 'otp', 'generatedTime'],
        where: {mobilenumber: mobilenumber, otp: otp, purpose: purpose}
    }).then(result => {
        if (result !== null) {
            res.status(200).json({
                status: true,
            });
            return;
        }
        res.status(200).json({
            status: false,
        });
    })
    .catch(err => {
        return next(err);
    })
}

exports.resendOTP = (req, res, next) => {
    
    const mobilenumber = req.body.mobilenumber;
    const purpose = req.body.purpose;
    OTP.findOne(
        {
            attributes: ['otp'],
            where: {mobilenumber: mobilenumber, purpose: purpose}
        }
    )
    .then(result => {
        if (result) {
            const otp = result.dataValues.otp;
            const message = 'Your verification passcode is ' + otp;
            let url = 'http://sms.sms4finsol.com/WebserviceSMS.aspX?User=sms4finsol&passwd=41490561&mobilenumber='+ mobilenumber +'&message= '+ message +' &sid=FINSOL&mtype=N&DR=Y';
            return axios.get(url);
        }
    })
    .then(result => {
        res.status(200).json({
            status: true,
            statusText: result.statusText,
            message: result.data
        })
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    })
}

exports.getTestData = (req, res, next) => {
    const userId = req.body.userId;
    const password = req.body.password;
    const obj = {
        userId: userId,
        password: password
    };

    axios.post('http://10.5.0.9:8080/api/auth/getLoginStatus', obj)
    .then(response => {
        console.log('response axios===============> ', response.data);
        res.json({
            result: response.data
        })
    })
    .catch(error => {
        
    })
}


exports.checkuuid = (req,res,next) => {

    const uuid = req.body.uuid;
    
    Login.findOne({where: {uuid: uuid}})
    .then(user => {
      if (user) {
            res.status(200).json({
                username: user.username,
                ismpin: user.mpin != null ? true : false
            });
        } else {
            res.status(200).json({ username: null, ismpin: false});
        }
    })
    .catch(err => {
        return next(err); 
    })
}

exports.changeuserpassword = (req,res,next) =>{

    const loginid = req.body.loginid;
    const mpin = req.body.mpin;
    const password = req.body.password;
    const uuid = req.body.uuid;

    bcrypt.hash(password, 12)
    .then(hashedPassword => { 
        return Login.update({password: hashedPassword, mpin: mpin,uuid: uuid, isfirsttimelogin: false},{where: {loginid: loginid}});
    })
    .then(result => {

        if (result[0]) {
            res.json({
                status: true,
                message: 'Password Successfully updated'
            });
        } else {
            res.json({
                status: false,
                message: 'Failed to update Password'
            });
        }
    })
    .catch(err => {
        return next(err);
    })
    .catch(err => {
        return next(err);
    })
}

exports.getdatabylogin = (req, res, next) => {
    let id = req.body.id;
    let isstudent = req.body.logintype;
    AuthDAO.getdatabylogintype(isstudent,id).then(result => {   
        let obj = {};
        let r = result[0];
        obj.institutename = r.INSTITUTIOINNAME
        if(isstudent === 1){
            obj.section = r.SECTIONNAME;
            obj.class = r.CLASSNAME;
            obj.rollno = r.ROLLNO;           
        }       
        res.status(200).json(obj);       
    }).catch(err => {
        logger.error('authcontroller::getdatabylogin '+err+'');        
        return next(err);
    })
}




