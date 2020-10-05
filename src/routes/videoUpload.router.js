const express = require('express');
const router = express.Router();
const videoUploadController = require('../controllers/videoUploadController');
const uploadFile = require('../lib/fileUpload');

// router.post('/saveVideo', uploadFile.upload.single('video'), videoUploadController.saveVideo);
router.post('/saveVideo', videoUploadController.saveVideo);
router.post('/getAllVideoDtails', videoUploadController.getAllVideoDtails);
router.post('/updateVideoDetails', videoUploadController.updateVideoDetails);
router.post('/deleteVideoDetails', videoUploadController.deleteVideoDetails);

module.exports = router;