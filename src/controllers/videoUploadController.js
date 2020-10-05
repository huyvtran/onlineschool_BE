const TeacherDAO = require('../DAO/teacherDAO');
const environment = require('../environments/environment');
const AWS = require('aws-sdk');
const fs = require('fs');
const axios = require('axios');
const logger = require('../util/logfile').log;

exports.saveVideo = (req, res, next) => {
    const file = req.file;
    const videoDetails = req.body;
    const curriculumName = videoDetails.curriculumName;
    const className = videoDetails.className;
    const subjectName = videoDetails.subjectName;
    const lessonName = videoDetails.lessonName;
    const instCurrClassSecId = videoDetails.instCurrClassSecId;
    const currSubClassLessId = videoDetails.currSubClassLessId;
    
    console.log(curriculumName, ' ', className, ' ', subjectName, ' ', lessonName);

    const AWS_STORAGE_BUCKET_NAME  = 'finsolonlineschool/' + curriculumName + '/' + className + '/' + subjectName + '/' + lessonName;
    const AWS_ACCESS_KEY_ID  = 'AKIAISKD4MPJDI564H3Q';
    const AWS_SECRET_ACCESS_KEY   = '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';

    /* saving the video in s3 Bucket -> Start */
        let s3Bucket = new AWS.S3({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
        });
        s3Bucket.createBucket(() => {
            let params = {
                Bucket: AWS_STORAGE_BUCKET_NAME,
                Key: instCurrClassSecId + '_' + file.originalname,
                Body: file.buffer,
                ACL:'public-read'
            };
            s3Bucket.upload(params, (err, data) => {
                if (err) {
                    return next(err);
                } else {
                    console.log('video is successfully uploaded to s3 Bucket ====> ', data);
                    if (data) {
                        const videoPath = data.Location;
                        let videoSeqNo;
                        let videoId;
                        if (videoDetails.modifyFlag === 'false') {
                            TeacherDAO.getMaxVideoSeqNo(videoDetails.instId, videoDetails.currSubClassLessId)
                            .then((result) => {
                                if (result.dataValues.MAXVIDEOSEQNO === null) {
                                    videoSeqNo = 1;
                                } else {
                                    videoSeqNo = (result.dataValues.MAXVIDEOSEQNO) + 1;
                                }
                                videoId = videoDetails.instId + videoDetails.currSubClassLessId + videoSeqNo;
    
                                return TeacherDAO.saveVideoDetails(videoDetails, videoSeqNo, videoId, videoPath);
                            })
                            .then(videoData => {
                                if (videoData) {
                                    if (videoDetails.videoStatus === '2') {
                                        TeacherDAO.updateVideoStatusinLessonLevel(currSubClassLessId, instCurrClassSecId)
                                        .then((result) => {
                                            if (result) {
                                                sendbulksms(videoDetails);
                                                res.status(200).json(videoData);
                                            }
                                        })
                                        .catch(err => {
                                            return next(err);
                                        })
                                    } else {
                                        res.status(200).json(videoData);
                                    }
                                }
                            })
                            .catch(err => {
                                return next(err);
                            })
                            .catch(err => {
                                return next(err);
                            })
                        } else {
                            videoSeqNo = videoDetails.videoSeqNo;
                            videoId = videoDetails.videoId;
                            TeacherDAO.saveVideoDetails(videoDetails, videoSeqNo, videoId, videoPath)
                            .then(videoData => {
                                if (videoData) {
                                    if (videoDetails.videoStatus === '2') {
                                        TeacherDAO.updateVideoStatusinLessonLevel(currSubClassLessId, instCurrClassSecId)
                                        .then((result) => {
                                            if (result) {
                                                sendbulksms(videoDetails);
                                                res.status(200).json(videoData);
                                            }
                                        })
                                        .catch(err => {
                                            return next(err);
                                        })
                                    } else {
                                        res.status(200).json(videoData);
                                    }
                                }
                            })
                            .catch(err => {
                                return next(err);
                            })
                        }
                    }
                }
            });
        });
    /* saving the video in s3 Bucket -> End */
}

getsmsobj = async(id, videoStatus) =>{
    let obj = {};
    if(videoStatus === 2){
       await TeacherDAO.getdataforsms(id).then(result =>{     
            obj.lessonName = result[0].LESSIONNAME;
            obj.subjectName = result[0].SUBJECTNAME;       
            obj.currSubId= result[0].CURSUBID;
            obj.instCurrClassSecId= result[0].INSTCURCLASSSECID;
        })
    }   
    return obj;
}

exports.updateVideoDetails = (req, res, next) => {
    const id = req.body.id;
    const videoStatus = req.body.videoStatus;
    const teacherRemarks = req.body.teacherRemarks;
    const currSubClassLessId = req.body.currSubClassLessId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    const obj = getsmsobj(id, videoStatus)
    TeacherDAO.updateVideoDetails(id, videoStatus, teacherRemarks)
    .then((result) => {
         if(videoStatus === '2') {
            TeacherDAO.updateVideoStatusinLessonLevel(currSubClassLessId, instCurrClassSecId)
            .then((result) => {
                if (result) {
                    obj.then(obj => {
                        sendbulksms(obj);
                    })
                    res.status(200).json(result);
                }
            })
            .catch(err => {
                return next(err);
            })
        } else {
            res.status(200).json(result);
        }
    })
    .catch(err => {
        return next(err);
    })
}

exports.deleteVideoDetails = (req, res, next) => {
    const videoDetails = req.body;
    const id = videoDetails.id;
    const curriculumName = videoDetails.curriculumName;
    const className = videoDetails.className;
    const subjectName = videoDetails.subjectName;
    const lessonName = videoDetails.lessonName;
    const instCurrClassSecId = videoDetails.instCurrClassSecId;
    const videoAudioName = videoDetails.videoAudioName;

    const AWS_STORAGE_BUCKET_NAME  = 'finsolonlineschool/' + curriculumName + '/' + className + '/' + subjectName + '/' + lessonName;
    const AWS_ACCESS_KEY_ID  = 'AKIAISKD4MPJDI564H3Q';
    const AWS_SECRET_ACCESS_KEY   = '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';

    console.log('storage bucket name =====> ', AWS_STORAGE_BUCKET_NAME);
    console.log('key =====> ', instCurrClassSecId + '_' + videoAudioName);

    let s3Bucket = new AWS.S3({
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    });
    s3Bucket.deleteObject({
        Bucket: AWS_STORAGE_BUCKET_NAME,
        Key: instCurrClassSecId + '_' + videoAudioName,
    }, (err, data) => {
        if (err) {
            console.log(err);
            return next(err);
        } else {
            console.log('successfull response after deleting record in s3 ========> ', data);
            TeacherDAO.deleteVideoDetails(id)
            .then((result) => {
                res.status(200).json(result);
            })
            .catch(err => {
                return next(err);
            })
        }
    })
}

exports.getAllVideoDtails = async (req, res, next) => { 
        
    const teacherId = req.body.teacherId;
    const currSubClassLessId = req.body.currSubClassLessId;
    const instCurrClassSecId = req.body.instCurrClassSecId;
    TeacherDAO.getAllVideoDetails(teacherId, currSubClassLessId, instCurrClassSecId)
    .then(teacherVideosData => {
        res.status(200).json(teacherVideosData);
    }).catch(err => {
        return next(err);
    })  
}

sendbulksms = async videoDetails => {   
    console.log('videoDetails ',videoDetails);    
    let msg = 'Video has been uploaded for following \nSubject  : '+videoDetails.subjectName+'\nTopic :'+videoDetails.lessonName;
    let mobilenos = 'NA';
    await TeacherDAO.getstudentsmobilenos(videoDetails.currSubId,videoDetails.instCurrClassSecId).then(result => {
        result.forEach(ele => {           
           mobilenos = mobilenos === 'NA' ? ele.MOBILENO : mobilenos+','+ele.MOBILENO;
        })
    })
    console.log(mobilenos);
    logger.info('videouploadcontrooler::sendbulksms - mobilenos '+mobilenos+'');  
     axios.get('http://sms.sms4finsol.com/WebserviceSMS.aspX',{
         params: {User:'sms4finsol',passwd:'41490561',mobilenumber:mobilenos,message:msg,sid:'FINSOL',mtype:'N',DR:'Y'}
        }).then(response =>{                                                       
            logger.info('videouploadcontrooler::sendbulksms - response'+response.status+'');     
        })
        .catch(err => {           
            logger.error('videouploadcontrooler::sendbulksms '+err+'');       
        })  
};